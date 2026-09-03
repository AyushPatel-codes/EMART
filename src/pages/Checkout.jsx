import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createPaymentOrder, verifyPayment, placeOrder } from '../api/endpoints';
import '../styles/checkout.css';

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handlePay = async () => {
        setError('');
        setProcessing(true);
        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setError('Could not load the payment gateway. Check your connection and try again.');
                setProcessing(false);
                return;
            }

            const { data: paymentOrder } = await createPaymentOrder({ amount: total });

            const options = {
                key: paymentOrder.key || paymentOrder.razorpayKey,
                amount: paymentOrder.amount || total * 100,
                currency: paymentOrder.currency || 'INR',
                order_id: paymentOrder.orderId || paymentOrder.id,
                name: 'MelaBazaar',
                description: 'Order payment',
                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        await placeOrder(user?.id, {
                            items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
                            total
                        });
                        clearCart();
                        navigate('/orders');
                    } catch {
                        setError('Payment succeeded but the order could not be recorded. Contact support.');
                    }
                },
                theme: { color: '#7b2ff7' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            setError('Could not start the payment. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 480 }}>
                <h1 style={{ marginBottom: 24 }}>Checkout</h1>
                {error && <div className="error-banner">{error}</div>}

                <div className="checkout-card">
                    <div className="checkout-lines">
                        {items.map((item) => (
                            <div className="checkout-line" key={item.productId}>
                                <span>{item.name} <span className="mono" style={{ color: 'var(--muted)' }}>× {item.quantity}</span></span>
                                <span className="mono">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-total">
                        <span>Total due</span>
                        <span className="mono">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <button className="btn btn-pay btn-block" onClick={handlePay} disabled={processing || items.length === 0}>
                        {processing ? 'Opening secure payment…' : `Pay ₹${total.toLocaleString('en-IN')} with Razorpay`}
                    </button>
                </div>
            </div>
        </div>
    );
}
