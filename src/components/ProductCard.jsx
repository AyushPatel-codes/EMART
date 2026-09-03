import { getCategory } from '../data/categories.js';
import '../styles/products.css';

function ProductImage({ imageUrl, category }) {
    const cat = getCategory(category);
    if (imageUrl) {
        return <img src={imageUrl} alt="" className="prod-img"/>;
    }

    return (
        <div
            className="prod-img prod-img-placeholder"
            style={{ background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}55) `}}
        >
            {cat.icon}
        </div>
    );
}

function Stars({ rating }) {
        if (rating === undefined || rating === null) return null;
        const rounded = Math.round(rating);
        return (
            <span className="mono prod-rating">
                {'★'.repeat(rounded)}
                {'☆'.repeat(5 - rounded)}
                <span className="prod-rating-num">{rating}</span>
            </span>
        );
}

export default function ProductCard({ product, onAddToCart, onBuyNow, disabled }) {
        return (
            <article className="prod-card">
                <div className="prod-img-wrap">
                    <ProductImage imageUrl={product.imageUrl} category={product.category} />
                    {product.soldCount != null && (
                        <span className="prod-sold-badge">{product.soldCount}+ sold</span>
                    )}
                </div>
                <h4 className="prod-name">{product.name}</h4>
                <Stars rating={product.rating}/>
                <div className="mono prod-price">${Number(product.price).toLocaleString('en-IN')}</div>
                <div className="prod-actions">
                    <button
                        className="btn btn-cart btn-sm"
                        disabled={disabled}
                        onClick={() => onAddToCart(product)}
                    >
                        ADD TO CART
                    </button>
                    <button
                        className="btn btn-buy btn-sm"
                        disabled={disabled}
                        onClick={() => onBuyNow(product)}
                    >
                        BUY NOW
                    </button>
                </div>
            </article>
        );
}

























