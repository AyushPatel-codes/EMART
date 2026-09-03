import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { addToCart as addToCartApi } from '../api/endpoints';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const stored = localStorage.getItem('cart_items');
        return stored ? JSON.parse(stored) : [];
    });

    const persist = (next) => {
        setItems(next);
        localStorage.setItem('cart_items', JSON.stringify(next));
    };

    const addItem = useCallback(async (product, quantity = 1) => {
        const existing = items.find((i) => i.productId === product.id);
        let next;
        if (existing) {
            next = items.map((i) =>
                i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
            );
        } else {
            next = [
                ...items,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    imageUrl: product.imageUrl,
                    quantity
                }
            ];
        }
        persist(next);

        try {
            await addToCartApi(product.id, { quantity });
        } catch (err) {
            throw err;
        }
    }, [items]);

    const updateQuantity = useCallback((productId, quantity) => {
        const next = items
            .map((i) => (i.productId === productId ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0);
        persist(next);
    }, [items]);

    const removeItem = useCallback((productId) => {
        persist(items.filter((i) => i.productId !== productId));
    }, [items]);

    const clearCart = useCallback(() => {
        persist([]);
    }, []);

    const total = useMemo(
        () => items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0),
        [items]
    );
    const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, count }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
