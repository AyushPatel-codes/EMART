package com.Project.EMART.service;

import com.Project.EMART.dto.CategoryRequest;
import com.Project.EMART.model.Category;
import com.Project.EMART.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category addCategory(CategoryRequest request) {
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new RuntimeException("Category with this slug already exists");
        }
        Category category = new Category();
        category.setSlug(request.getSlug());
        category.setLabel(request.getLabel());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setSlug(request.getSlug());
        category.setLabel(request.getLabel());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }
        categoryRepository.deleteById(id);
    }
}