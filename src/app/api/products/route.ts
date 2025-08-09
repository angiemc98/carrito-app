import { NextApiResponse,  NextApiRequest} from 'next';
import { Product } from '@/types/product';
import { ApiError } from 'next/dist/server/api-utils';
import { NextResponse } from 'next/server';
import { products } from '@/data/products';

// Manejo de la solicitud GET para obtener todos los productos
export async function GET() {
    try {
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
