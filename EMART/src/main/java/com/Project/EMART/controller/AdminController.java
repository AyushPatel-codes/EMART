package com.Project.EMART.controller;

import com.Project.EMART.model.Order;
import com.Project.EMART.model.Product;
import com.Project.EMART.service.OrderService;
import com.Project.EMART.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @PostMapping("/products")
    public Product addProduct(@RequestBody Product product){
        return productService.saveProduct(product);
    }

    @DeleteMapping("/products/{id}")
    public String deleteProduct(@PathVariable String id){

        productService.deleteProduct(id);

        return "Product Deleted";
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }

    @PutMapping("/orders/{id}")
    public Order updateOrderStatus(
            @PathVariable String id,
            @RequestParam String status){

        return orderService.updateStatus(id,status);
    }
}
