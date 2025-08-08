"use client";
import { CartItem, CartResponse } from "@/types/product";
import { useEffect, useState } from "react";


interface CartProps {
    refreshTrigger: number
}

const Cart: React.FC<CartProps> = ({ refreshTrigger }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchCart();
    }, [refreshTrigger]);

    const fetchCart = async (): Promise<void> => {
        try {
            const responser = await fetch('/api/cart');
            if (!responser.ok) {
                throw new Error('Failed to fetch cart');
            }
            const data: CartResponse = await responser.json();
            setCart(data.items);
            setTotal(data.total);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async (): Promise<void> => {
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
            });
            if (response.ok) {
                setCart([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };
    return (
        <div className="cart-container">
            <h2>Carrito de Compras</h2>
            {loading ? (
                <div className="loading">Actualizando Carrito...</div>
            ) : (
                <div className="loading">
                    {cart.length === 0 ? (
                        <p className="empty-cart">El carrito está vacío.</p>
                    ) : (
                        <>
                        <div className="cart-items">
                            {cart.map((item: CartItem) => (
                                <div key={item.id} className="cart-item">
                                   <span className="item-name">{item.name}</span>
                                   <span className="item-quantity">Cantidad: {item.quantity}</span>
                                   <span className="item-price">Precio: ${item.price}</span>
                                   <span className="item-total">Total: ${item.price * item.quantity}</span>
                                </div>
                            ))}

                        </div>
                        <div className="cart-total">
                            <strong>Total: ${total}</strong>
                        </div>
                        <button
                            onClick={clearCart}
                            className="clear-cart-btn"
                            type="button"
                        >
                            Limpiar Carrito
                        </button>
                        </> 
                    )}
                   
                </div>
            )}

        </div>
    );
};
export default Cart;
