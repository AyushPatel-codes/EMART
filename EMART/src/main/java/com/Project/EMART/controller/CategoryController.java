package com.Project.EMART.controller;


import com.Project.EMART.dto.CategoryRequest;
import com.Project.EMART.model.Category;
import com.Project.EMART.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/admin")
    public Category addCategory(@RequestBody CategoryRequest request) {
        return categoryService.addCategory(request);
    }

    @PutMapping("/admin/{id}")
    public Category updateCategory(@PathVariable String id, @RequestBody CategoryRequest request) {
        return categoryService.updateCategory(id, request);
    }

    @DeleteMapping("/admin/{id}")
    public void deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
    }
}