package com.Project.EMART.config;

import com.Project.EMART.model.Category;
import com.Project.EMART.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final CategoryRepository categories;

    @Override
    public void run(String... args) {
        if (categories.count() > 0) return;
        List.of("Electronics", "Fashion", "Home & Kitchen", "Books", "Beauty", "Sports & Outdoors", "Toys & Games", "Grocery")
                .forEach(n -> categories.save(Category.builder().name(n).description(n).build()));
    }
}
