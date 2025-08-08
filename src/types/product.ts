
export interface Product {
    id: number;
    name: string;
    price: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface CartResponse {
    items: CartItem[];
    total: number;
}

export interface AddToCartRequest {
    productId: number;
}

export interface AddToCartResponse {
    message: string;
    cart: CartItem[];
    total: number;
}

export interface OptimizationResponse {
    item: Product[];
    total: number;
}

export interface ApiError {
    message: string;
}
