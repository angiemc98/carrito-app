'use client';

import { OptimizationResponse, Product } from "@/types/product";
import React, { useState, useEffect } from "react";



export default function Optimize() {
    const [products, setProducts] = useState<Product[]>([]);
    const [budget, setBudget] = useState<number>(300);
    const [result, setResult] = useState<OptimizationResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((error) => setError("Error fetching products"));
    }, []);
    const handleOptimize = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
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
        <div className="section">
            <h2>Optimización de Productos</h2>
            <p>Optimiza tus productos según tu presupuesto.</p>

            <div style={{ marginBottom: "1rem" }}>
                <label>
                    Presupuesto: $
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        min="0"
                        style={{ marginLeft: "0.5rem" }}
                    />
                </label>
                <button onClick={handleOptimize} className="add-to-cart-btn" style={{marginLeft: "1rem"}}>
                    Optimizar
                </button>
        </div>
            <h3>Productos disponibles</h3>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - ${product.price}
                    </li>
                ))}
            </ul>
            {loading && <p>Optimizando...</p>}
            {error && <p style = {{color: "red"}}>{error}</p>}
            
            { result && (
                <div style={{ marginTop: "1rem" }}>
                    <h4>Resultados de la Optimización</h4>
                    <ul>
                        {result.item.length > 0 ? (
                            <>
                            <ul>
                                {result.item.map((p) => (
                                    <li key={p.id}>
                                        {p.name} - ${p.price}
                                    </li>
                                ))}
                            </ul>
                            </>
                        ) : (
                            <p>No se encontraron combinaciones dentro del presupuesto.</p>
                    )}
                    </ul>
                </div>
            )}
            </div>
    );
}