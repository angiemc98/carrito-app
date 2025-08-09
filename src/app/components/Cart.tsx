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
            setCart(Array.isArray(data.items) ? data.items : []);
            setTotal(data.total ?? 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart([]);
            setTotal(0);
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

    const handleQuantityChange = async (productId: number, quantity: number): Promise<void> => {
        try {
            const response= await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity }),
            });
            if (response.ok) {
                const updatedCart= await response.json();
                setCart(Array.isArray(updatedCart.items) ? updatedCart.items : []);
                setTotal(updatedCart.total ?? 0);
            } else {
                console.error('Error updating quantity:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    return (
        <div className="cart-container">
            <h2>Carrito de Compras</h2>
            {loading ? (
                <div className="loading">Actualizando Carrito...</div>
            ) : cart.length === 0 ? (
                <div className="loading">
                    <p className="empty-cart">El carrito está vacío.</p>
                </div>
            ) : (
                <>
                <div className="cart-items">
                    {cart.map((item: CartItem) => (
                                <div key={item.id} className="cart-item">
                                   <span className="item-name">{item.name}</span>
                                   <input type="number" min="0" style={{ width: '60px' }} value={item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))} />
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
export default Cart;
