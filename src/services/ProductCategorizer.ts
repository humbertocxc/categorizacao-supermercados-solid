import { Product, CategorizedProduct } from '../interfaces/Product';
import { extractProductKey } from '../domain/product/ProductKeyExtractor';

export class ProductCategorizer {
    categorizeProducts(products: Product[]): CategorizedProduct[] {
        const categories = this.groupProductsByCategory(products);
        return this.transformCategoriesToResult(categories);
    }

    private groupProductsByCategory(products: Product[]): Map<string, { products: { title: string; supermarket: string }[]; canonicalName: string }> {
        const categories: Map<string, { products: { title: string; supermarket: string }[]; canonicalName: string }> = new Map();

        products.forEach((product: Product) => {
            const key: string = extractProductKey(product.title);

            if (!categories.has(key)) {
                categories.set(key, {
                    products: [],
                    canonicalName: product.title
                });
            }

            categories.get(key)!.products.push({
                title: product.title,
                supermarket: product.supermarket
            });
        });

        return categories;
    }

    private transformCategoriesToResult(categories: Map<string, { products: { title: string; supermarket: string }[]; canonicalName: string }>): CategorizedProduct[] {
        return Array.from(categories.entries()).map(([_, data]) => ({
            category: data.canonicalName,
            count: data.products.length,
            products: data.products
        }));
    }
}
