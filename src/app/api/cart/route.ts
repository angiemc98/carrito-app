
import { AddToCartRequest, AddToCartResponse, CartItem, CartResponse, Product } from '@/types/product';
import { NextResponse, NextRequest } from 'next/server';

let cart: CartItem[] = [];

const products: Product[] = [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 150 },
    { id: 3, name: 'Product C', price: 200 },
    { id: 4, name: 'Product D', price: 250 },
];

const Total = (cartItems: CartItem[]): number => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export async function GET() {
    try {
        const response: CartResponse = { items: cart, total: Total(cart) };
        return NextResponse.json(response)
    }
    catch (error) {
        return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
    }
 } 
 
export async function POST(request: NextRequest)
{
    try {
        const body: AddToCartRequest = await request.json();
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }

        const product = products.find(p => p.id === parseInt(productId.toString()));

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const existingItem = cart.findIndex(item => item.id === product.id);

        if (existingItem !== -1) {
            cart[existingItem].quantity += 1;
        } else {
            cart.push({...product, quantity: 1 });
        }

        const response: AddToCartResponse = {
            message: 'Product added to cart',
            cart,
            total: Total(cart)
        };
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to add product to cart' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        cart = [];
        return NextResponse.json({ message: 'Cart cleared', cart, total: 0 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to clear cart' }, { status: 500 });
    }
}
       
