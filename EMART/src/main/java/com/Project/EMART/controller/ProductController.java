package com.Project.EMART.controller;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.model.Category;
import com.Project.EMART.service.CategoryService;
import com.Project.EMART.service.ProductService;
import com.Project.EMART.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/** Public catalogue endpoints (no authentication). */
@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService products;
    private final CategoryService categories;
    private final ReviewService reviews;

    @GetMapping({"/api/products", "/api/products/search"})
    public PageResponse<ProductDto> search(@RequestParam(required = false) String keyword,
                                           @RequestParam(required = false) String category,
                                           @RequestParam(required = false) Double minPrice,
                                           @RequestParam(required = false) Double maxPrice,
                                           @RequestParam(required = false) Double rating,
                                           @RequestParam(defaultValue = "newest") String sort,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "12") int size) {
        return products.search(keyword, category, minPrice, maxPrice, rating, sort, page, size, true, null);
    }

    @GetMapping("/api/products/{id}")
    public ProductDto get(@PathVariable String id) { return products.getPublic(id); }

    @GetMapping("/api/products/{id}/stock")
    public Map<String, Object> stock(@PathVariable String id) {
        ProductDto p = products.getPublic(id);
        return Map.of("productId", p.id(), "stock", p.stock(), "inStock", p.inStock());
    }

    @GetMapping("/api/products/{id}/reviews")
    public PageResponse<ReviewDto> reviews(@PathVariable String id, @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        return reviews.forProduct(id, page, size);
    }

    @GetMapping("/api/categories")
    public List<Category> categories() { return categories.list(); }
}
