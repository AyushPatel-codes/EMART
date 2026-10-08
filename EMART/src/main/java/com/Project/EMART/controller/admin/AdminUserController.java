package com.Project.EMART.controller.admin;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.model.*;
import com.Project.EMART.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Everything under /api/admin/** is restricted to ROLE_ADMIN in SecurityConfig. */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {
    private final AdminService admin;
    private final OrderService orders;
    private final ProductService products;

    // ---------- customers ----------
    @GetMapping("/customers")
    public PageResponse<UserDto> customers(@RequestParam(required = false) String keyword, @RequestParam(required = false) UserStatus status,
                                           @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return admin.listUsers(Role.ROLE_CUSTOMER, keyword, status, page, size);
    }

    @GetMapping("/customers/{id}")
    public UserDto customer(@PathVariable String id) { return admin.getUser(id, Role.ROLE_CUSTOMER); }

    @PutMapping("/customers/{id}/suspend")
    public UserDto suspendCustomer(@PathVariable String id) { return admin.suspend(id, Role.ROLE_CUSTOMER); }

    @PutMapping("/customers/{id}/activate")
    public UserDto activateCustomer(@PathVariable String id) { return admin.activate(id, Role.ROLE_CUSTOMER); }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) { admin.deleteCustomer(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/customers/{id}/orders")
    public PageResponse<OrderDto> customerOrders(@PathVariable String id, @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
        admin.getUser(id, Role.ROLE_CUSTOMER);
        return orders.customerOrders(id, page, size);
    }

    // ---------- sellers ----------
    @GetMapping("/sellers")
    public PageResponse<UserDto> sellers(@RequestParam(required = false) String keyword, @RequestParam(required = false) UserStatus status,
                                         @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return admin.listUsers(Role.ROLE_SELLER, keyword, status, page, size);
    }

    @GetMapping("/sellers/{id}")
    public UserDto seller(@PathVariable String id) { return admin.getUser(id, Role.ROLE_SELLER); }

    @PutMapping("/sellers/{id}/approve")
    public UserDto approve(@PathVariable String id) { return admin.approveSeller(id); }

    @PutMapping("/sellers/{id}/reject")
    public UserDto reject(@PathVariable String id) { return admin.rejectSeller(id); }

    @PutMapping("/sellers/{id}/suspend")
    public UserDto suspendSeller(@PathVariable String id) { return admin.suspend(id, Role.ROLE_SELLER); }

    @PutMapping("/sellers/{id}/activate")
    public UserDto activateSeller(@PathVariable String id) { return admin.activate(id, Role.ROLE_SELLER); }

    @DeleteMapping("/sellers/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable String id) { admin.deleteSeller(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/sellers/{id}/products")
    public PageResponse<ProductDto> sellerProducts(@PathVariable String id, @RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        admin.getUser(id, Role.ROLE_SELLER);
        return products.search(null, null, null, null, null, "newest", page, size, false, id);
    }

    @GetMapping("/sellers/{id}/orders")
    public PageResponse<OrderDto> sellerOrders(@PathVariable String id, @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size) {
        admin.getUser(id, Role.ROLE_SELLER);
        return orders.sellerOrders(id, null, page, size);
    }
}
