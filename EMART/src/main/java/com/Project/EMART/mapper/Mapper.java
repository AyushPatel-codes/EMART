package com.Project.EMART.mapper;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.model.*;
import java.util.List;

public final class Mapper {
    private Mapper() {}

    public static UserDto toUserDto(User u) {
        return new UserDto(u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getRole().name(),
                u.getStatus().name(), u.getAddress(), u.getStoreName(), u.getBusinessAddress(),
                u.getAddresses(), u.getCreatedAt());
    }

    public static ProductDto toProductDto(Product p) {
        return new ProductDto(p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getDiscount(),
                p.getFinalPrice(), p.getCategory(), p.getBrand(), p.getImages(), p.getStock(), p.getStock() > 0,
                p.getSellerId(), p.getSellerName(), p.getRating(), p.getReviewCount(), p.isActive(),
                p.getCreatedAt(), p.getUpdatedAt());
    }

    public static CartDto toCartDto(Cart c) {
        List<CartItemDto> items = c.getItems().stream().map(i -> new CartItemDto(i.getProductId(),
                i.getProductName(), i.getImage(), i.getQuantity(), i.getPrice(), i.getSubtotal())).toList();
        return new CartDto(c.getCustomerId(), items, c.getTotalAmount(), c.getUpdatedAt());
    }

    public static OrderDto toOrderDto(Order o) { return toOrderDto(o, null); }

    /** When sellerId is given, only that seller's items (and their subtotal) are exposed. */
    public static OrderDto toOrderDto(Order o, String sellerId) {
        List<OrderItem> src = sellerId == null ? o.getItems()
                : o.getItems().stream().filter(i -> sellerId.equals(i.getSellerId())).toList();
        List<OrderItemDto> items = src.stream().map(i -> new OrderItemDto(i.getProductId(), i.getProductName(),
                i.getImage(), i.getQuantity(), i.getPrice(), i.getSubtotal(), i.getSellerId(), i.getSellerName(),
                i.getStatus())).toList();
        double total = sellerId == null ? o.getTotalAmount()
                : com.Project.EMART.util.PageUtil.round2(src.stream().mapToDouble(OrderItem::getSubtotal).sum());
        return new OrderDto(o.getId(), o.getCustomerId(), o.getCustomerName(), items, o.getShippingAddress(), total,
                o.getPaymentMethod(), o.getPaymentStatus(), o.getOrderStatus(), o.getCreatedAt(), o.getUpdatedAt());
    }

    public static ReviewDto toReviewDto(Review r) {
        return new ReviewDto(r.getId(), r.getProductId(), r.getProductName(), r.getCustomerId(),
                r.getCustomerName(), r.getRating(), r.getComment(), r.getCreatedAt());
    }
}
