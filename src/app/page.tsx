"use client";
import { ApiError } from "next/dist/server/api-utils";
import Cart from "./components/Cart";
import React from "react";
import ProductList from "./components/ProductList";
import Optimize from "./components/Optimize";


const Home: React.FC = () => {
  const [cartRefreh, setCartRefresh] = React.useState<number>(0);
  
  const handleAddToCart = async (productId: number): Promise<void> => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      if (response.ok) {
        const data = await response.json();

        setCartRefresh(prev => prev + 1);
        alert('Producto agregado al carrito');
      } else {
        const error: ApiError = await response.json();
        alert(`Error: ${error.message}`);
        
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Error al agregar el producto al carrito');
    }
  };
 
  return (
    <div className="app">
      <header className="app-header">
        <h1>Carrito de Compras - Prueba Técnica</h1>
      </header>
      <main className="app-main">
        <div className="section">
          <ProductList onAddToCart={handleAddToCart} />
        </div>
        <div className="section">
          <Cart refreshTrigger={cartRefreh} />
        </div>
        <div className="section">
          <Optimize />
        </div>

      </main>
    </div>
  );
};
  export default Home;