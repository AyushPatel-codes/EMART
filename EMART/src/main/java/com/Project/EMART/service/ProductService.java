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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository products;
    private final CategoryRepository categories;
    private final UserRepository users;
    private final MongoTemplate mongo;

    // reads
    public PageResponse<ProductDto> search(String keyword, String category, Double minPrice, Double maxPrice, Double rating,
                                           String sort, int page, int size, boolean activeOnly, String sellerId) {
        List<Criteria> cs = new ArrayList<>();
        if (activeOnly) cs.add(Criteria.where("active").is(true));
        if (sellerId != null) cs.add(Criteria.where("sellerId").is(sellerId));
        if (StringUtils.hasText(keyword)) {
            Pattern p = PageUtil.regex(keyword);
            cs.add(new Criteria().orOperator(Criteria.where("name").regex(p), Criteria.where("brand").regex(p),
                    Criteria.where("description").regex(p)));
        }
        if (StringUtils.hasText(category))
            cs.add(Criteria.where("category").regex(Pattern.compile("^" + Pattern.quote(category.trim()) + "$", Pattern.CASE_INSENSITIVE)));
        if (minPrice != null) cs.add(Criteria.where("finalPrice").gte(minPrice));
        if (maxPrice != null) cs.add(Criteria.where("finalPrice").lte(maxPrice));
        if (rating != null) cs.add(Criteria.where("rating").gte(rating));
        Query q = new Query();
        if (!cs.isEmpty()) q.addCriteria(new Criteria().andOperator(cs));
        Sort s = switch (sort == null ? "newest" : sort) {
            case "priceAsc" -> Sort.by("finalPrice").ascending();
            case "priceDesc" -> Sort.by("finalPrice").descending();
            case "rating" -> Sort.by(Sort.Order.desc("rating"), Sort.Order.desc("reviewCount"));
            default -> Sort.by("createdAt").descending();
        };
        return PageUtil.page(mongo, q, PageUtil.of(page, size, s), Product.class, Mapper::toProductDto);
    }

    public PageResponse<ProductDto> inventory(String sellerId, Integer maxStock, int page, int size) {
        Query q = Query.query(Criteria.where("sellerId").is(sellerId));
        if (maxStock != null) q.addCriteria(Criteria.where("stock").lte(maxStock));
        return PageUtil.page(mongo, q, PageUtil.of(page, size, Sort.by("stock").ascending()), Product.class, Mapper::toProductDto);
    }

    public ProductDto getPublic(String id) {
        return Mapper.toProductDto(products.findById(id).filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found")));
    }

    public ProductDto getAny(String id) { return Mapper.toProductDto(find(id)); }

    public ProductDto getOwn(String id, String sellerId) { return Mapper.toProductDto(own(id, sellerId)); }

    // seller writes
    public ProductDto create(String sellerId, ProductRequest r) {
        User seller = approvedSeller(sellerId);
        Category c = category(r.category());
        Product p = new Product();
        p.setSellerId(sellerId);
        p.setSellerName(seller.getStoreName());
        p.setRating(0); p.setReviewCount(0); p.setActive(true);
        p.setCreatedAt(LocalDateTime.now());
        apply(p, r, c);
        return Mapper.toProductDto(products.save(p));
    }

    public ProductDto update(String sellerId, String id, ProductRequest r) {
        approvedSeller(sellerId);
        Product p = own(id, sellerId);
        apply(p, r, category(r.category()));
        return Mapper.toProductDto(products.save(p));
    }

    public ProductDto updateStock(String sellerId, String id, int stock) {
        approvedSeller(sellerId);
        Product p = own(id, sellerId);
        p.setStock(stock);
        p.setUpdatedAt(LocalDateTime.now());
        return Mapper.toProductDto(products.save(p));
    }

    public void delete(String sellerId, String id) {
        approvedSeller(sellerId);
        products.delete(own(id, sellerId));
    }

    //admin
    public ProductDto setActive(String id, boolean active) {
        Product p = find(id);
        p.setActive(active);
        p.setUpdatedAt(LocalDateTime.now());
        return Mapper.toProductDto(products.save(p));
    }

    public void adminDelete(String id) { products.delete(find(id)); }

    //helpers
    private Product find(String id) { return products.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found")); }

    private Product own(String id, String sellerId) {
        return products.findByIdAndSellerId(id, sellerId).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private Category category(String name) {
        return categories.findByNameIgnoreCase(name.trim()).orElseThrow(() -> new ValidationException("Unknown category: " + name));
    }

    private User approvedSeller(String sellerId) {
        User s = users.findById(sellerId).orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        if (s.getStatus() != UserStatus.APPROVED)
            throw new AccessDeniedException("Your seller account is " + s.getStatus() + ". Admin approval is required to manage products.");
        return s;
    }

    private void apply(Product p, ProductRequest r, Category c) {
        double d = r.discount() == null ? 0 : r.discount();
        p.setName(r.name().trim());
        p.setDescription(r.description());
        p.setPrice(PageUtil.round2(r.price()));
        p.setDiscount(d);
        p.setFinalPrice(PageUtil.round2(r.price() * (1 - d / 100.0)));
        p.setCategory(c.getName());
        p.setBrand(r.brand());
        p.setImages(r.images() == null ? new ArrayList<>() : r.images());
        p.setStock(r.stock());
        p.setUpdatedAt(LocalDateTime.now());
    }
}
