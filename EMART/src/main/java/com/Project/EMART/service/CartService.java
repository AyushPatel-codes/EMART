package com.Project.EMART.service;

import com.Project.EMART.model.Cart.CartItem;
import com.Project.EMART.model.Cart;
import com.Project.EMART.model.Product;
import com.Project.EMART.repository.CartRepository;
import com.Project.EMART.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public Cart addToCart(String userId, String productId) {
        Cart cart = cartRepository.findByUserId(userId);

        if(cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
        }

        Product product = productRepository.findById(productId).orElse(null);
        if(product == null) return cart;

        //Checking if items already exists in the cart!!!

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if(existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity()+1);
        }else {
            CartItem newItem = new CartItem();
            newItem.setProductId(productId);
            newItem.setName(product.getName());
            newItem.setImage(product.getImages() != null ? product.getImages().get(0) : "");
            newItem.setPrice(product.getPrice().doubleValue());
            newItem.setQuantity(1);
            cart.getItems().add(newItem);
        }

        calculateTotal(cart);
        return cartRepository.save(cart);
    }

    private void calculateTotal(Cart cart) {
        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        cart.setTotalPrice(total);
    }

    public Cart getCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId);
        if(cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
        }
        return cart;
    }
}
