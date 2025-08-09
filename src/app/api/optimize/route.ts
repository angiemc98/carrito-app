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
            { id: 1, name: 'Product A', price: 100 },
            { id: 2, name: 'Product B', price: 150 },
            { id: 3, name: 'Product C', price: 200 },
            { id: 4, name: 'Product D', price: 250 },
            { id: 5, name: 'Product E', price: 300 },
            { id: 6, name: 'Product F', price: 350 },
            { id: 7, name: 'Product G', price: 400 },
            { id: 8, name: 'Product H', price: 450 },
            { id: 9, name: 'Product I', price: 500 },
            { id: 10, name: 'Product J', price: 550 },
        ];

        const result = findBestCombination(products, budget);
        return NextResponse.json(result);
    }
