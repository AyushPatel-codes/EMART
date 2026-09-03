package com.Project.EMART.service;

import com.Project.EMART.model.Product;
import com.Project.EMART.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product saveProduct(Product product){
        return productRepository.save(product);
    }

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(String id){
        return productRepository.findById(id);
    }

    public Product updateProduct(Product product){
        return productRepository.save(product);
    }

    public void deleteProduct(String id){
        productRepository.deleteById(id);
    }
}