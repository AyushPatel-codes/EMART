package com.Project.EMART.service;

import com.Project.EMART.dto.Dtos.ProductDto;
import com.Project.EMART.exception.ResourceNotFoundException;
import com.Project.EMART.mapper.Mapper;
import com.Project.EMART.model.*;
import com.Project.EMART.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlists;
    private final ProductRepository products;

    public List<ProductDto> list(String cid) {
        return wishlists.findByCustomerId(cid)
                .map(w -> products.findAllById(w.getProductIds()).stream().filter(Product::isActive).map(Mapper::toProductDto).toList())
                .orElse(List.of());
    }

    public List<ProductDto> add(String cid, String productId) {
        products.findById(productId).filter(Product::isActive).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        Wishlist w = wishlists.findByCustomerId(cid).orElseGet(() -> Wishlist.builder().customerId(cid).build());
        w.getProductIds().add(productId);
        wishlists.save(w);
        return list(cid);
    }

    public List<ProductDto> remove(String cid, String productId) {
        wishlists.findByCustomerId(cid).ifPresent(w -> { w.getProductIds().remove(productId); wishlists.save(w); });
        return list(cid);
    }

    public int count(String cid) { return wishlists.findByCustomerId(cid).map(w -> w.getProductIds().size()).orElse(0); }
}
