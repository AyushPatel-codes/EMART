package com.Project.EMART.dto;

import com.Project.EMART.model.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

/** All request/response DTOs. Entities (and password hashes) are never returned directly. */
public final class Dtos {
    private Dtos() {}

    private static final String PHONE = "^[+0-9][0-9\\s-]{6,14}$";

    // ---------- Auth ----------
    public record CustomerRegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 72, message = "Password must be 8-72 characters") String password,
            @NotBlank @Pattern(regexp = PHONE, message = "Invalid phone number") String phone,
            @NotBlank String address) {}

    public record SellerRegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 72, message = "Password must be 8-72 characters") String password,
            @NotBlank @Pattern(regexp = PHONE, message = "Invalid phone number") String phone,
            @NotBlank String storeName,
            @NotBlank String businessAddress) {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record AuthResponse(String token, String role, String userId, String name, String email, String status) {}

    // ---------- Users ----------
    public record UserDto(String id, String name, String email, String phone, String role, String status,
                          String address, String storeName, String businessAddress,
                          List<Address> addresses, LocalDateTime createdAt) {}

    public record ProfileUpdateRequest(
            @NotBlank String name,
            @Pattern(regexp = PHONE, message = "Invalid phone number") String phone,
            String address, String storeName, String businessAddress) {}

    // ---------- Catalog ----------
    public record ProductRequest(
            @NotBlank String name,
            String description,
            @NotNull @Positive(message = "Price must be positive") Double price,
            @DecimalMin("0") @DecimalMax("100") Double discount,
            @NotBlank String category,
            String brand,
            List<String> images,
            @NotNull @PositiveOrZero(message = "Stock cannot be negative") Integer stock) {}

    public record ProductDto(String id, String name, String description, double price, double discount,
                             double finalPrice, String category, String brand, List<String> images, int stock,
                             boolean inStock, String sellerId, String sellerName, double rating, int reviewCount,
                             boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {}

    public record StockRequest(@NotNull @PositiveOrZero(message = "Stock cannot be negative") Integer stock) {}

    public record CategoryRequest(@NotBlank String name, String description) {}

    // ---------- Cart ----------
    public record CartItemRequest(@NotBlank String productId,
                                  @NotNull @Positive(message = "Quantity must be positive") Integer quantity) {}

    public record QuantityRequest(@NotNull @Positive(message = "Quantity must be positive") Integer quantity) {}

    public record CartItemDto(String productId, String productName, String image, int quantity, double price, double subtotal) {}

    public record CartDto(String customerId, List<CartItemDto> items, double totalAmount, LocalDateTime updatedAt) {}

    // ---------- Orders ----------
    /** Provide either addressId (a saved address) or an inline shippingAddress. */
    public record PlaceOrderRequest(String addressId, @Valid Address shippingAddress, @NotNull PaymentMethod paymentMethod) {}

    public record OrderItemDto(String productId, String productName, String image, int quantity, double price,
                               double subtotal, String sellerId, String sellerName, OrderStatus status) {}

    public record OrderDto(String id, String customerId, String customerName, List<OrderItemDto> items,
                           Address shippingAddress, double totalAmount, PaymentMethod paymentMethod,
                           PaymentStatus paymentStatus, OrderStatus orderStatus,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {}

    public record OrderStatusRequest(@NotNull OrderStatus status) {}

    // ---------- Reviews ----------
    public record ReviewRequest(@NotNull @Min(1) @Max(5) Integer rating, @Size(max = 1000) String comment) {}

    public record ReviewDto(String id, String productId, String productName, String customerId,
                            String customerName, int rating, String comment, LocalDateTime createdAt) {}

    // ---------- Common ----------
    public record PageResponse<T>(List<T> content, int page, int size, long totalElements, int totalPages) {}
}
