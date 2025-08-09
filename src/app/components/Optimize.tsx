'use client';
import { OptimizationResponse, Product } from "@/types/product";
import React, { useState, useEffect } from "react";

// Componente de optimización
export default function Optimize() {
    const [products, setProducts] = useState<Product[]>([]);
    const [budget, setBudget] = useState<number>(300);
    const [result, setResult] = useState<OptimizationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Efecto para obtener los productos al montar el componente
    useEffect(() => {
        fetch('/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((error) => setError("Error fetching products"));
    }, []);
    //Funcion para manejar la optimización
    const handleOptimize = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
          // Enviamos la solicitud de optimización
            const res = await fetch('/api/optimize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ budget }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Failed to optimize products');
            }
            const data: OptimizationResponse = await res.json();
            setResult(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="optimize-section">
  <h2>Optimización de Productos</h2>
  <p>Optimiza tus productos según tu presupuesto.</p>

  <div className="budget-input">
    <label htmlFor="budget">Presupuesto:</label>
    <input
      id="budget"
      type="number"
      value={budget}
      onChange={(e) => setBudget(Number(e.target.value))}
      min="0"
    />
    <button
      onClick={handleOptimize}
      className="optimize-btn"
      type="button"
    >
      Optimizar
    </button>
  </div>

  <h3>Productos disponibles</h3>
  <div className="products-grid">
    {products.map((product) => (
      <div key={product.id} className="product-card">
        <h4>{product.name}</h4>
        <p className="price">${product.price}</p>
      </div>
    ))}
  </div>

  {loading && <p>Optimizando...</p>}
  {error && <p style={{ color: "red" }}>{error}</p>}

  {result && (
    <div className="optimization-result">
      <h4>Resultados de la Optimización</h4>
      {result.item.length > 0 ? (
        <div className="products-grid">
          {result.item.map((p) => (
            <div key={p.id} className="product-card highlight">
              <h4>{p.name}</h4>
              <p className="price">${p.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron combinaciones dentro del presupuesto.</p>
      )}
      <div className="result-total">
        <strong>Total: ${result.total} / ${budget}</strong>
      </div>
    </div>
  )}
</div>

    );
}