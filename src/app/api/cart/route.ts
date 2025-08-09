
import { AddToCartRequest, AddToCartResponse, CartItem, CartResponse, Product } from '@/types/product';
import { console } from 'inspector';
import { NextResponse, NextRequest } from 'next/server';
import { products } from '@/data/products';

let cart: CartItem[] = [];


const Total = (cartItems: CartItem[]): number => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

//Obtenemos lo que hay en el carrito y el total
export async function GET() {
    try {
        const response: CartResponse = { items: cart, total: Total(cart) };
        return NextResponse.json(response)
    }
    catch (error) {
        return NextResponse.json({ message: 'Failed to fetch cart' }, { status: 500 });
    }
 } 
// Añadimos un producto al carrito
export async function POST(request: NextRequest)
{
    try {
        const body: AddToCartRequest = await request.json();
        const { productId } = body;

        // Validamos que el productId exista
        if (!productId) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }
        // Buscamos el producto en la lista de productos
        const product = products.find(p => p.id === parseInt(productId.toString()));

        // Si no existe el producto, devolvemos un error
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        // Verificamos si el producto ya está en el carrito
        const existingItem = cart.findIndex(item => item.id === product.id);

        if (existingItem !== -1) {
            cart[existingItem].quantity += 1;
        } else {
            cart.push({...product, quantity: 1 });
        }
        // Añadimos el producto al carrito
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

// Actualizamos la cantidad del producto directamente en el carrito
export async function PUT(request: NextRequest) {
    const {productId, quantity} = await request.json();

    //  Validamos que la cantidad sea válida
    if (quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
        // Si la cantidad es 0 o negativa, eliminamos el producto del carrito
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
        }
    }
    return NextResponse.json({
       items: cart,
       total: Total(cart)
    });
}

//Limpiamos el carrito
export async function DELETE() {
    try {
        cart = [];
        return NextResponse.json({ message: 'Cart cleared', cart, total: 0 });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to clear cart' }, { status: 500 });
    }
}
       
