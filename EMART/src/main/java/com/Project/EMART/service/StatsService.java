package com.Project.EMART.service;

import com.Project.EMART.mapper.Mapper;
import com.Project.EMART.model.*;
import com.Project.EMART.repository.*;
import com.Project.EMART.util.PageUtil;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final UserRepository users;
    private final ProductRepository products;
    private final OrderRepository orders;
    private final CartRepository carts;
    private final WishlistService wishlists;
    private final MongoTemplate mongo;

    public Map<String, Object> admin() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("orderStatus").ne(OrderStatus.CANCELLED.name())),
                Aggregation.group().sum("totalAmount").as("total"));
        Document d = mongo.aggregate(agg, Order.class, Document.class).getUniqueMappedResult();
        double revenue = d == null ? 0 : ((Number) d.get("total")).doubleValue();
        long customers = users.countByRole(Role.ROLE_CUSTOMER), sellers = users.countByRole(Role.ROLE_SELLER);

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalUsers", customers + sellers);
        m.put("totalCustomers", customers);
        m.put("totalSellers", sellers);
        m.put("pendingSellers", users.countByRoleAndStatus(Role.ROLE_SELLER, UserStatus.PENDING));
        m.put("totalProducts", products.count());
        m.put("totalOrders", orders.count());
        m.put("totalRevenue", PageUtil.round2(revenue));
        m.put("recentOrders", mongo.find(new Query().with(Sort.by("createdAt").descending()).limit(5), Order.class)
                .stream().map(Mapper::toOrderDto).toList());
        m.put("recentRegistrations", mongo.find(new Query().with(Sort.by("createdAt").descending()).limit(5), User.class)
                .stream().map(Mapper::toUserDto).toList());
        return m;
    }

    public Map<String, Object> seller(String sellerId) {
        List<Product> ps = products.findBySellerId(sellerId);
        List<Order> os = mongo.find(Query.query(Criteria.where("items.sellerId").is(sellerId)).with(Sort.by("createdAt").descending()), Order.class);
        double revenue = 0; long sales = 0;
        for (Order o : os)
            for (OrderItem i : o.getItems())
                if (sellerId.equals(i.getSellerId()) && i.getStatus() != OrderStatus.CANCELLED) { revenue += i.getSubtotal(); sales += i.getQuantity(); }

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalProducts", ps.size());
        m.put("totalStock", ps.stream().mapToLong(Product::getStock).sum());
        m.put("lowStockProducts", ps.stream().filter(p -> p.getStock() <= 5).count());
        m.put("totalOrders", os.size());
        m.put("totalSales", sales);
        m.put("totalRevenue", PageUtil.round2(revenue));
        m.put("recentOrders", os.stream().limit(5).map(o -> Mapper.toOrderDto(o, sellerId)).toList());
        return m;
    }

    public Map<String, Object> customer(String cid) {
        long total = orders.countByCustomerId(cid);
        long delivered = orders.countByCustomerIdAndOrderStatus(cid, OrderStatus.DELIVERED);
        long cancelled = orders.countByCustomerIdAndOrderStatus(cid, OrderStatus.CANCELLED);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalOrders", total);
        m.put("pendingOrders", total - delivered - cancelled);
        m.put("deliveredOrders", delivered);
        m.put("wishlistCount", wishlists.count(cid));
        m.put("cartCount", carts.findByCustomerId(cid).map(c -> c.getItems().size()).orElse(0));
        return m;
    }
}
