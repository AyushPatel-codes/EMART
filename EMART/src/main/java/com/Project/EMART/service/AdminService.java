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
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository users;
    private final ProductRepository products;
    private final CartRepository carts;
    private final WishlistRepository wishlists;
    private final OrderService orders;
    private final MongoTemplate mongo;

    public PageResponse<UserDto> listUsers(Role role, String keyword, UserStatus status, int page, int size) {
        List<Criteria> cs = new ArrayList<>();
        cs.add(Criteria.where("role").is(role.name()));
        if (status != null) cs.add(Criteria.where("status").is(status.name()));
        if (StringUtils.hasText(keyword)) {
            Pattern p = PageUtil.regex(keyword);
            cs.add(new Criteria().orOperator(Criteria.where("name").regex(p), Criteria.where("email").regex(p),
                    Criteria.where("storeName").regex(p)));
        }
        return PageUtil.page(mongo, new Query(new Criteria().andOperator(cs)),
                PageUtil.of(page, size, Sort.by("createdAt").descending()), User.class, Mapper::toUserDto);
    }

    public UserDto getUser(String id, Role role) { return Mapper.toUserDto(find(id, role)); }

    public UserDto approveSeller(String id) {
        User u = find(id, Role.ROLE_SELLER);
        if (u.getStatus() != UserStatus.PENDING && u.getStatus() != UserStatus.REJECTED)
            throw new ValidationException("Only PENDING or REJECTED sellers can be approved");
        return setStatus(u, UserStatus.APPROVED);
    }

    public UserDto rejectSeller(String id) {
        User u = find(id, Role.ROLE_SELLER);
        if (u.getStatus() != UserStatus.PENDING) throw new ValidationException("Only PENDING sellers can be rejected");
        return setStatus(u, UserStatus.REJECTED);
    }

    public UserDto suspend(String id, Role role) {
        User u = find(id, role);
        if (u.getStatus() == UserStatus.SUSPENDED) throw new ValidationException("Already suspended");
        if (role == Role.ROLE_SELLER) setProductsActive(id, false);   // hide the seller's catalogue
        return setStatus(u, UserStatus.SUSPENDED);
    }

    public UserDto activate(String id, Role role) {
        User u = find(id, role);
        if (u.getStatus() != UserStatus.SUSPENDED) throw new ValidationException("Only suspended accounts can be activated");
        if (role == Role.ROLE_SELLER) setProductsActive(id, true);
        return setStatus(u, role == Role.ROLE_SELLER ? UserStatus.APPROVED : UserStatus.ACTIVE);
    }

    public void deleteCustomer(String id) {
        User u = find(id, Role.ROLE_CUSTOMER);
        if (orders.hasOpenOrdersForCustomer(id)) throw new ValidationException("Customer has orders in progress and cannot be deleted");
        carts.deleteByCustomerId(id);
        wishlists.deleteByCustomerId(id);
        users.delete(u);
    }

    public void deleteSeller(String id) {
        User u = find(id, Role.ROLE_SELLER);
        if (orders.hasOpenOrdersForSeller(id)) throw new ValidationException("Seller has orders in progress and cannot be deleted");
        products.deleteBySellerId(id);
        users.delete(u);
    }

    private User find(String id, Role role) {
        return users.findById(id).filter(u -> u.getRole() == role)
                .orElseThrow(() -> new ResourceNotFoundException(role == Role.ROLE_SELLER ? "Seller not found" : "Customer not found"));
    }

    private UserDto setStatus(User u, UserStatus s) { u.setStatus(s); return Mapper.toUserDto(users.save(u)); }

    private void setProductsActive(String sellerId, boolean active) {
        mongo.updateMulti(Query.query(Criteria.where("sellerId").is(sellerId)), new Update().set("active", active), Product.class);
    }
}
