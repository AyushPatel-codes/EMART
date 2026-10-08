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
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviews;
    private final ProductRepository products;
    private final UserRepository users;
    private final MongoTemplate mongo;

    public ReviewDto create(String customerId, String productId, ReviewRequest r) {
        Product p = products.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        boolean bought = mongo.exists(Query.query(Criteria.where("customerId").is(customerId)
                .and("items").elemMatch(Criteria.where("productId").is(productId).and("status").is(OrderStatus.DELIVERED.name()))), Order.class);
        if (!bought) throw new ValidationException("You can review a product only after it has been delivered to you");
        if (reviews.existsByProductIdAndCustomerId(productId, customerId))
            throw new DuplicateResourceException("You have already reviewed this product");
        User u = users.findById(customerId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Review saved = reviews.save(Review.builder().productId(productId).productName(p.getName()).customerId(customerId)
                .customerName(u.getName()).rating(r.rating()).comment(r.comment()).createdAt(LocalDateTime.now()).build());
        recalc(productId);
        return Mapper.toReviewDto(saved);
    }

    public PageResponse<ReviewDto> forProduct(String productId, int page, int size) {
        return list(Query.query(Criteria.where("productId").is(productId)), page, size);
    }

    public PageResponse<ReviewDto> mine(String customerId, int page, int size) {
        return list(Query.query(Criteria.where("customerId").is(customerId)), page, size);
    }

    public PageResponse<ReviewDto> forSeller(String sellerId, int page, int size) {
        List<String> ids = products.findBySellerId(sellerId).stream().map(Product::getId).toList();
        return list(Query.query(Criteria.where("productId").in(ids)), page, size);
    }

    public PageResponse<ReviewDto> adminList(String productId, int page, int size) {
        Query q = new Query();
        if (StringUtils.hasText(productId)) q.addCriteria(Criteria.where("productId").is(productId));
        return list(q, page, size);
    }

    public void deleteOwn(String customerId, String id) {
        Review r = reviews.findById(id).filter(x -> x.getCustomerId().equals(customerId))
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviews.delete(r);
        recalc(r.getProductId());
    }

    public void adminDelete(String id) {
        Review r = reviews.findById(id).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviews.delete(r);
        recalc(r.getProductId());
    }

    private PageResponse<ReviewDto> list(Query q, int page, int size) {
        return PageUtil.page(mongo, q, PageUtil.of(page, size, Sort.by("createdAt").descending()), Review.class, Mapper::toReviewDto);
    }

    private void recalc(String productId) {
        List<Review> all = reviews.findByProductId(productId);
        double avg = all.isEmpty() ? 0 : Math.round(all.stream().mapToInt(Review::getRating).average().orElse(0) * 10.0) / 10.0;
        mongo.updateFirst(Query.query(Criteria.where("id").is(productId)),
                new Update().set("rating", avg).set("reviewCount", all.size()), Product.class);
    }
}
