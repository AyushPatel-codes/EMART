package com.Project.EMART.controller.admin;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.model.Category;
import com.Project.EMART.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminCatalogController {
    private final ProductService products;
    private final CategoryService categories;
    private final ReviewService reviews;

    // ---------- products ----------
    @GetMapping("/products")
    public PageResponse<ProductDto> products(@RequestParam(required = false) String keyword, @RequestParam(required = false) String category,
                                             @RequestParam(defaultValue = "newest") String sort,
                                             @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return products.search(keyword, category, null, null, null, sort, page, size, false, null);
    }

    @GetMapping("/products/{id}")
    public ProductDto product(@PathVariable String id) { return products.getAny(id); }

    @PutMapping("/products/{id}/activate")
    public ProductDto activate(@PathVariable String id) { return products.setActive(id, true); }

    @PutMapping("/products/{id}/deactivate")
    public ProductDto deactivate(@PathVariable String id) { return products.setActive(id, false); }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) { products.adminDelete(id); return ResponseEntity.noContent().build(); }

    // ---------- categories ----------
    @GetMapping("/categories")
    public List<Category> categories() { return categories.list(); }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CategoryRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categories.create(r));
    }

    @PutMapping("/categories/{id}")
    public Category updateCategory(@PathVariable String id, @Valid @RequestBody CategoryRequest r) { return categories.update(id, r); }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) { categories.delete(id); return ResponseEntity.noContent().build(); }

    // ---------- reviews ----------
    @GetMapping("/reviews")
    public PageResponse<ReviewDto> reviews(@RequestParam(required = false) String productId, @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        return reviews.adminList(productId, page, size);
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) { reviews.adminDelete(id); return ResponseEntity.noContent().build(); }
}
