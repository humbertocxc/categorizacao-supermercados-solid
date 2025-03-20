import { Product } from './interfaces/Product';
import { ProductCategorizer } from './services/ProductCategorizer';
import { FileManager } from './services/FileManager';

class ProductProcessor {
    private fileManager: FileManager;
    private categorizer: ProductCategorizer;

    constructor() {
        this.fileManager = new FileManager();
        this.categorizer = new ProductCategorizer();
    }

    process(inputFilePath: string, outputFilePath: string): void {
        try {
            const rawData: string = this.fileManager.readFile(inputFilePath);
            const products: Product[] = JSON.parse(rawData);
            const categorized = this.categorizer.categorizeProducts(products);
            this.fileManager.writeFile(outputFilePath, JSON.stringify(categorized, null, 2));
        } catch (error) {
            console.error('Erro ao processar o arquivo JSON:', error);
        }
    }
}

const processor = new ProductProcessor();
processor.process('./data01.json', './output.json');
