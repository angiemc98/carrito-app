"use client";
import { Product } from "@/types/product";
import React, {useState, useEffect} from "react";


interface ProductListProps {
    onAddToCart: (productId: number) => Promise<void>;
}


const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        fetchProducts()
    }, []);

    const fetchProducts = async (): Promise<void> => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data: Product[] = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleAddToCart = async (productId: number): Promise<void> => {
        await onAddToCart(productId);
    };
    if (loading) {
        return <div className="loading">Cargando Productos...</div>;
    }
    return (
        <div>
            <h2>Lista de Productos</h2>
                <div className="products-grid">
                    {products.map((product: Product) => (
                        <div key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <p className="price">Precio: ${product.price}</p>
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                className="add-to-cart-btn"
                                type="button"
                            >
                                Agregar al Carrito
                            </button>
                        </div>
                    ))}
                </div> 
        </div>
    );
};

export default ProductList;
