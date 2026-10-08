package com.Project.EMART.service;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.exception.*;
import com.Project.EMART.mapper.Mapper;
import com.Project.EMART.model.*;
import com.Project.EMART.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository users;
    private final MongoTemplate mongo;

    public User get(String id) {
        return users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserDto profile(String id) { return Mapper.toUserDto(get(id)); }

    public UserDto update(String id, ProfileUpdateRequest r) {
        User u = get(id);
        u.setName(r.name().trim());
        if (r.phone() != null) u.setPhone(r.phone());
        if (u.getRole() == Role.ROLE_CUSTOMER) {
            if (r.address() != null) u.setAddress(r.address());
        } else if (u.getRole() == Role.ROLE_SELLER) {
            if (StringUtils.hasText(r.storeName())) {
                u.setStoreName(r.storeName().trim());
                mongo.updateMulti(Query.query(Criteria.where("sellerId").is(id)),
                        new Update().set("sellerName", u.getStoreName()), Product.class);
            }
            if (r.businessAddress() != null) u.setBusinessAddress(r.businessAddress());
        }
        return Mapper.toUserDto(users.save(u));
    }

    // ---------- shipping addresses ----------
    public List<Address> addresses(String id) { return get(id).getAddresses(); }

    public Address addAddress(String id, Address a) {
        User u = get(id);
        a.setId(UUID.randomUUID().toString());
        if (u.getAddresses().isEmpty()) a.setDefaultAddress(true);
        if (a.isDefaultAddress()) u.getAddresses().forEach(x -> x.setDefaultAddress(false));
        u.getAddresses().add(a);
        users.save(u);
        return a;
    }

    public Address updateAddress(String id, String addressId, Address in) {
        User u = get(id);
        Address a = u.getAddresses().stream().filter(x -> x.getId().equals(addressId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        a.setFullName(in.getFullName()); a.setPhone(in.getPhone()); a.setLine1(in.getLine1()); a.setLine2(in.getLine2());
        a.setCity(in.getCity()); a.setState(in.getState()); a.setPostalCode(in.getPostalCode()); a.setCountry(in.getCountry());
        if (in.isDefaultAddress()) {
            u.getAddresses().forEach(x -> x.setDefaultAddress(false));
            a.setDefaultAddress(true);
        }
        users.save(u);
        return a;
    }

    public void deleteAddress(String id, String addressId) {
        User u = get(id);
        if (!u.getAddresses().removeIf(x -> x.getId().equals(addressId))) throw new ResourceNotFoundException("Address not found");
        if (!u.getAddresses().isEmpty() && u.getAddresses().stream().noneMatch(Address::isDefaultAddress))
            u.getAddresses().get(0).setDefaultAddress(true);
        users.save(u);
    }
}
