import { NextApiResponse,  NextApiRequest} from 'next';
import { Product } from '@/types/product';
import { ApiError } from 'next/dist/server/api-utils';
import { NextResponse } from 'next/server';


const products: Product[]  = [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 150 },
    { id: 3, name: 'Product C', price: 200 },
    { id: 4, name: 'Product D', price: 250 },
]

export async function GET() {
    try {
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
