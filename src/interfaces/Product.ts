export interface Product {
    id: number;
    title: string;
    supermarket: string;
    price: number;
}

export interface CategorizedProduct {
    category: string;
    count: number;
    products: { title: string; supermarket: string, price: number }[];
}
