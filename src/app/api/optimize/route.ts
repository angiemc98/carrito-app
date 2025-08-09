import { OptimizationResponse, Product } from "@/types/product";
import { Combo } from "next/font/google";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { products } from "@/data/products";


// Función para encontrar la mejor combinación de productos dentro del presupuesto
function findBestCombination(items: Product[], budget: number): OptimizationResponse {
    
    let best: Product[] = [];
    let bestTotal = 0;
    // Función de retroceso para encontrar la mejor combinación
    const backtrack = (combo: Product[], index: number, total:number) => {
        if (total > budget) return;
        if (total > bestTotal) {
            best = [...combo];
            bestTotal = total;
        }
        for (let i= index; i < items.length; i++) {
            backtrack([...combo, items[i]], i + 1, total + items [i].price);
        }
    };
    // Iniciamos la búsqueda de la mejor combinación
    backtrack([], 0, 0);
    return {
        item: best, 
        total: bestTotal
    };
}  
// Manejo de la solicitud POST para verificar el presupuesto
    export async function POST(req: NextRequest) {
        const {budget} = await req.json();
        // Validamos que el presupuesto sea un número y sea positivo
        if(typeof budget !== 'number' || budget <= 0 ) {
            return NextResponse.json({
                message: 'Presupuesto invalido'
            }, 
            {
                status: 400});
        }
        const result = findBestCombination(products, budget);
        return NextResponse.json(result);
    }
