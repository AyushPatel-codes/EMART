package com.Project.EMART.service;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.exception.*;
import com.Project.EMART.mapper.Mapper;
import com.Project.EMART.model.*;
import com.Project.EMART.repository.*;
import com.Project.EMART.util.PageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.OptionalInt;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orders;
    private final CartRepository carts;
    private final ProductRepository products;
    private final UserRepository users;
    private final MongoTemplate mongo;

    // ================= customer =================
    public OrderDto place(String customerId, PlaceOrderRequest r) {
        User customer = users.findById(customerId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = carts.findByCustomerId(customerId).filter(c -> !c.getItems().isEmpty())
                .orElseThrow(() -> new ValidationException("Your cart is empty"));
        Address ship = resolveAddress(customer, r);

        List<OrderItem> items = new ArrayList<>();
        try {
            for (CartItem ci : cart.getItems()) {
                Product p = products.findById(ci.getProductId()).filter(Product::isActive)
                        .orElseThrow(() -> new ValidationException("'" + ci.getProductName() + "' is no longer available"));
                // Atomic reservation: decrement only if enough stock remains (prevents overselling under concurrency)
                var res = mongo.updateFirst(Query.query(Criteria.where("id").is(p.getId()).and("active").is(true)
                        .and("stock").gte(ci.getQuantity())), new Update().inc("stock", -ci.getQuantity()), Product.class);
                if (res.getModifiedCount() == 0) throw new InsufficientStockException(p.getName(), p.getStock());
                items.add(OrderItem.builder().productId(p.getId()).productName(p.getName())
                        .image(p.getImages() == null || p.getImages().isEmpty() ? null : p.getImages().get(0))
                        .quantity(ci.getQuantity()).price(p.getFinalPrice())
                        .subtotal(PageUtil.round2(p.getFinalPrice() * ci.getQuantity()))
                        .sellerId(p.getSellerId()).sellerName(p.getSellerName()).status(OrderStatus.PLACED).build());
            }
        } catch (RuntimeException e) {
            items.forEach(this::restock);   // roll back reservations made so far
            throw e;
        }

        LocalDateTime now = LocalDateTime.now();
        Order o = Order.builder().customerId(customerId).customerName(customer.getName()).items(items).shippingAddress(ship)
                .totalAmount(PageUtil.round2(items.stream().mapToDouble(OrderItem::getSubtotal).sum()))
                .paymentMethod(r.paymentMethod())
                // Mock online payment is treated as instantly successful; COD is collected on delivery.
                .paymentStatus(r.paymentMethod() == PaymentMethod.MOCK_ONLINE ? PaymentStatus.PAID : PaymentStatus.PENDING)
                .orderStatus(OrderStatus.PLACED).createdAt(now).updatedAt(now).build();
        o = orders.save(o);

        cart.getItems().clear();
        cart.setTotalAmount(0);
        cart.setUpdatedAt(now);
        carts.save(cart);
        return Mapper.toOrderDto(o);
    }

    public PageResponse<OrderDto> customerOrders(String customerId, int page, int size) {
        return PageUtil.page(mongo, Query.query(Criteria.where("customerId").is(customerId)),
                PageUtil.of(page, size, Sort.by("createdAt").descending()), Order.class, o -> Mapper.toOrderDto(o));
    }

    public OrderDto customerOrder(String customerId, String id) {
        return Mapper.toOrderDto(orders.findByIdAndCustomerId(id, customerId).orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    public OrderDto cancel(String customerId, String id) {
        Order o = orders.findByIdAndCustomerId(id, customerId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (o.getOrderStatus() == OrderStatus.CANCELLED) throw new ValidationException("Order is already cancelled");
        boolean tooLate = o.getItems().stream().filter(i -> i.getStatus() != OrderStatus.CANCELLED)
                .anyMatch(i -> i.getStatus().ordinal() > OrderStatus.CONFIRMED.ordinal());
        if (tooLate) throw new ValidationException("This order can no longer be cancelled because it is already being processed");
        for (OrderItem i : o.getItems()) {
            if (i.getStatus() != OrderStatus.CANCELLED) { restock(i); i.setStatus(OrderStatus.CANCELLED); }
        }
        o.setOrderStatus(OrderStatus.CANCELLED);
        if (o.getPaymentStatus() == PaymentStatus.PAID) o.setPaymentStatus(PaymentStatus.REFUNDED);
        o.setUpdatedAt(LocalDateTime.now());
        return Mapper.toOrderDto(orders.save(o));
    }

    // ================= seller =================
    public PageResponse<OrderDto> sellerOrders(String sellerId, OrderStatus status, int page, int size) {
        Criteria c = Criteria.where("items.sellerId").is(sellerId);
        if (status != null) c = Criteria.where("items").elemMatch(Criteria.where("sellerId").is(sellerId).and("status").is(status.name()));
        return PageUtil.page(mongo, Query.query(c), PageUtil.of(page, size, Sort.by("createdAt").descending()),
                Order.class, o -> Mapper.toOrderDto(o, sellerId));
    }

    public OrderDto sellerOrder(String sellerId, String id) {
        return Mapper.toOrderDto(sellerOwned(sellerId, id), sellerId);
    }

    /** A seller may only move THEIR OWN line items forward; the order status is then derived from all items. */
    public OrderDto sellerUpdateStatus(String sellerId, String id, OrderStatus status) {
        if (status == OrderStatus.PLACED || status == OrderStatus.CANCELLED)
            throw new ValidationException("Sellers can only move orders forward (CONFIRMED to DELIVERED)");
        Order o = sellerOwned(sellerId, id);
        if (o.getOrderStatus() == OrderStatus.CANCELLED) throw new ValidationException("Order is cancelled");
        List<OrderItem> mine = o.getItems().stream()
                .filter(i -> sellerId.equals(i.getSellerId()) && i.getStatus() != OrderStatus.CANCELLED).toList();
        if (mine.isEmpty()) throw new ValidationException("No active items for this seller in this order");
        for (OrderItem i : mine)
            if (status.ordinal() <= i.getStatus().ordinal())
                throw new ValidationException("Status can only move forward (current: " + i.getStatus() + ")");
        mine.forEach(i -> i.setStatus(status));
        recompute(o);
        return Mapper.toOrderDto(orders.save(o), sellerId);
    }

    private Order sellerOwned(String sellerId, String id) {
        return orders.findById(id).filter(o -> o.getItems().stream().anyMatch(i -> sellerId.equals(i.getSellerId())))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    // ================= admin =================
    public PageResponse<OrderDto> adminOrders(String keyword, OrderStatus status, int page, int size) {
        List<Criteria> cs = new ArrayList<>();
        if (status != null) cs.add(Criteria.where("orderStatus").is(status.name()));
        if (StringUtils.hasText(keyword)) {
            Pattern p = PageUtil.regex(keyword);
            cs.add(new Criteria().orOperator(Criteria.where("customerName").regex(p), Criteria.where("id").is(keyword.trim())));
        }
        Query q = new Query();
        if (!cs.isEmpty()) q.addCriteria(new Criteria().andOperator(cs));
        return PageUtil.page(mongo, q, PageUtil.of(page, size, Sort.by("createdAt").descending()), Order.class, o -> Mapper.toOrderDto(o));
    }

    public OrderDto adminOrder(String id) {
        return Mapper.toOrderDto(orders.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

    public boolean hasOpenOrdersForCustomer(String customerId) {
        return mongo.exists(Query.query(Criteria.where("customerId").is(customerId)
                .and("orderStatus").nin(OrderStatus.DELIVERED.name(), OrderStatus.CANCELLED.name())), Order.class);
    }

    public boolean hasOpenOrdersForSeller(String sellerId) {
        return mongo.exists(Query.query(Criteria.where("items").elemMatch(Criteria.where("sellerId").is(sellerId)
                .and("status").nin(OrderStatus.DELIVERED.name(), OrderStatus.CANCELLED.name()))), Order.class);
    }

    // ================= helpers =================
    private void recompute(Order o) {
        OptionalInt min = o.getItems().stream().filter(i -> i.getStatus() != OrderStatus.CANCELLED)
                .mapToInt(i -> i.getStatus().ordinal()).min();
        o.setOrderStatus(min.isPresent() ? OrderStatus.values()[min.getAsInt()] : OrderStatus.CANCELLED);
        if (o.getOrderStatus() == OrderStatus.DELIVERED && o.getPaymentMethod() == PaymentMethod.COD)
            o.setPaymentStatus(PaymentStatus.PAID);   // cash collected on delivery
        o.setUpdatedAt(LocalDateTime.now());
    }

    private void restock(OrderItem i) {
        mongo.updateFirst(Query.query(Criteria.where("id").is(i.getProductId())), new Update().inc("stock", i.getQuantity()), Product.class);
    }

    private Address resolveAddress(User customer, PlaceOrderRequest r) {
        if (r.shippingAddress() != null) {
            Address a = r.shippingAddress();
            a.setId(UUID.randomUUID().toString());
            return a;
        }
        if (StringUtils.hasText(r.addressId()))
            return customer.getAddresses().stream().filter(a -> a.getId().equals(r.addressId())).findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        throw new ValidationException("A shipping address is required");
    }
}
