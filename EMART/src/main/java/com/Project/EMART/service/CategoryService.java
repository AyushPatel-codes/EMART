package com.Project.EMART.service;

import com.Project.EMART.dto.Dtos.CategoryRequest;
import com.Project.EMART.exception.*;
import com.Project.EMART.model.*;
import com.Project.EMART.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categories;
    private final ProductRepository products;
    private final MongoTemplate mongo;

    public List<Category> list() { return categories.findAll(Sort.by("name")); }

    public Category create(CategoryRequest r) {
        if (categories.existsByNameIgnoreCase(r.name().trim())) throw new DuplicateResourceException("Category already exists");
        return categories.save(Category.builder().name(r.name().trim()).description(r.description()).build());
    }

    public Category update(String id, CategoryRequest r) {
        Category c = categories.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        String newName = r.name().trim();
        String oldName = c.getName();
        if (!newName.equalsIgnoreCase(oldName) && categories.existsByNameIgnoreCase(newName))
            throw new DuplicateResourceException("Category already exists");
        c.setName(newName);
        c.setDescription(r.description());
        categories.save(c);
        if (!newName.equals(oldName))
            mongo.updateMulti(Query.query(Criteria.where("category").is(oldName)), new Update().set("category", newName), Product.class);
        return c;
    }

    public void delete(String id) {
        Category c = categories.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (products.countByCategoryIgnoreCase(c.getName()) > 0)
            throw new ValidationException("Cannot delete a category that still has products");
        categories.delete(c);
    }
}
