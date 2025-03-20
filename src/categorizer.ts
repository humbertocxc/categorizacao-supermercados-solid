import * as fs from 'fs';

interface Product {
    id: number;
    title: string;
    supermarket: string;
}

interface CategorizedProduct {
    category: string;
    count: number;
    products: { title: string; supermarket: string }[];
}

function normalizeString(str: string): string {
    return str
        .normalize('NFD') // Remove acentos
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function extractProductKey(title: string): string {
    const normalized: string = normalizeString(title);
    const words: string[] = normalized.split(' ');
    
    const sizePattern: RegExp = /(\d+(\.\d+)?\s*(kg|l|litro|quilo))/i;
    let size: string = '';
    let brand: string = '';
    let type: string = '';
    const description: string[] = [];

    words.forEach((word: string) => {
        if (sizePattern.test(word)) {
            size = word;
        } else if (['integral', 'desnatado', 'branco', 'carioca', 'semi-desnatado'].includes(word)) {
            type = word;
        } else if (['piracanjuba', 'italac', 'parmalat', 'camil', 'tio', 'joao'].includes(word)) {
            if (word === 'tio' && words[words.indexOf(word) + 1] === 'joao') {
                brand = 'tio joao';
            } else if (brand !== 'tio joao') {
                brand = word;
            }
        } else {
            description.push(word);
        }
    });

    return `${brand}-${type}-${description.join('-')}-${size}`;
}

function categorizeProducts(products: Product[]): CategorizedProduct[] {
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

    const result: CategorizedProduct[] = Array.from(categories.entries()).map(([_, data]) => ({
        category: data.canonicalName,
        count: data.products.length,
        products: data.products
    }));

    return result;
}

function processJsonFile(filePath: string): void {
    try {
        const rawData: string = fs.readFileSync(filePath, 'utf8');
        const products: Product[] = JSON.parse(rawData);

        const categorized: CategorizedProduct[] = categorizeProducts(products);
        
        console.log(JSON.stringify(categorized, null, 2));
    } catch (error) {
        console.error('Erro ao processar o arquivo JSON:', error);
    }
}

processJsonFile('./data01.json');

export { categorizeProducts };
