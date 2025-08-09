import { OptimizationResponse, Product } from "@/types/product";
import { Combo } from "next/font/google";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";





function findBestCombination(items: Product[], budget: number): OptimizationResponse {
    
    let best: Product[] = [];
    let bestTotal = 0;

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
    backtrack([], 0, 0);
    return {
        item: best, 
        total: bestTotal
    };
}   

    export async function POST(req: NextRequest) {
        const {budget} = await req.json();

        if(typeof budget !== 'number' || budget <= 0 ) {
            return NextResponse.json({
                message: 'Presupuesto invalido'
            }, 
            {
                status: 400});
        }
        // Simulamos una lista de productos
        const products: Product[] = [
            { id: 1, name: "Producto 1", price: 100 },
            { id: 2, name: "Producto 2", price: 200 },
            { id: 3, name: "Producto 3", price: 300 },
        ];

        const result = findBestCombination(products, budget);
        return NextResponse.json(result);
    }
