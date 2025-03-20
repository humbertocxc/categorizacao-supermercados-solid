export interface Product {
    id: number;
    title: string;
    supermarket: string;
}

export interface CategorizedProduct {
    category: string;
    count: number;
    products: { title: string; supermarket: string }[];
}
