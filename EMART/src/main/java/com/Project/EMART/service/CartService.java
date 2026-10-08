package com.Project.EMART.service;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.exception.*;
import com.Project.EMART.mapper.Mapper;
import com.Project.EMART.model.*;
import com.Project.EMART.repository.*;
import com.Project.EMART.util.PageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository carts;
    private final ProductRepository products;

    public CartDto get(String cid) {
        Cart c = load(cid);
        refresh(c);
        if (c.getId() != null) carts.save(c);
        return Mapper.toCartDto(c);
    }

    public CartDto add(String cid, CartItemRequest r) {
        Product p = activeProduct(r.productId());
        Cart c = load(cid);
        CartItem it = find(c, p.getId());
        int qty = (it == null ? 0 : it.getQuantity()) + r.quantity();
        checkStock(p, qty);
        if (it == null) c.getItems().add(CartItem.builder().productId(p.getId()).quantity(qty).build());
        else it.setQuantity(qty);
        return save(c);
    }

    public CartDto update(String cid, String productId, int qty) {
        Cart c = load(cid);
        CartItem it = find(c, productId);
        if (it == null) throw new ResourceNotFoundException("Item not in cart");
        checkStock(activeProduct(productId), qty);
        it.setQuantity(qty);
        return save(c);
    }

    public CartDto remove(String cid, String productId) {
        Cart c = load(cid);
        if (!c.getItems().removeIf(i -> i.getProductId().equals(productId))) throw new ResourceNotFoundException("Item not in cart");
        return save(c);
    }

    public CartDto clear(String cid) {
        Cart c = load(cid);
        c.getItems().clear();
        return save(c);
    }

    // ---------- helpers ----------
    private Cart load(String cid) {
        return carts.findByCustomerId(cid).orElseGet(() -> Cart.builder().customerId(cid).items(new ArrayList<>()).build());
    }

    private CartItem find(Cart c, String pid) {
        return c.getItems().stream().filter(i -> i.getProductId().equals(pid)).findFirst().orElse(null);
    }

    private Product activeProduct(String id) {
        return products.findById(id).filter(Product::isActive).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private void checkStock(Product p, int qty) {
        if (qty > p.getStock()) throw new InsufficientStockException(p.getName(), p.getStock());
    }

    /** Re-prices every line from the live product and drops lines whose product disappeared/was deactivated. */
    private void refresh(Cart c) {
        double total = 0;
        var it = c.getItems().iterator();
        while (it.hasNext()) {
            CartItem i = it.next();
            Product p = products.findById(i.getProductId()).filter(Product::isActive).orElse(null);
            if (p == null) { it.remove(); continue; }
            i.setProductName(p.getName());
            i.setImage(p.getImages() == null || p.getImages().isEmpty() ? null : p.getImages().get(0));
            i.setPrice(p.getFinalPrice());
            i.setSubtotal(PageUtil.round2(p.getFinalPrice() * i.getQuantity()));
            total += i.getSubtotal();
        }
        c.setTotalAmount(PageUtil.round2(total));
    }

    private CartDto save(Cart c) {
        refresh(c);
        c.setUpdatedAt(LocalDateTime.now());
        return Mapper.toCartDto(carts.save(c));
    }
}
