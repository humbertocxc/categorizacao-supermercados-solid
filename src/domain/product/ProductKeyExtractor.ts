import { WordProcessor } from '../../interfaces/WordProcessor';
import { WeightProcessor } from './processors/WeightProcessor';
import { normalizeString } from '../../utils/stringUtils';

export class ProductKeyExtractor {
    public weightPattern: RegExp = /(\d+)\s*(kg|g|quilo|quilos|grama|gramas)?/i;
    public types: Set<string> = new Set(['integral', 'desnatado', 'branco', 'carioca', 'semi-desnatado']);
    public brands: Set<string> = new Set(['piracanjuba', 'italac', 'parmalat', 'camil', 'tio joao']);
    public ignoredWords: Set<string> = new Set(['tipo']);
    public size: string = '';
    public brand: string = '';
    public type: string = '';
    public description: string[] = [];
    private processors: WordProcessor[];

    constructor(public words: string[]) {
        this.processors = [
            new WeightProcessor(this),
        ];
    }

    public extract(): string {
        const processedWords = new Set<string>();

        this.words.forEach((word: string, index: number) => {
            if (!this.ignoredWords.has(word)) {
                this.processors.forEach(processor => processor.process(word, index));
                processedWords.add(word);
            }
        });

        const selectedTypes = Array.from(this.types).filter(type => this.words.includes(type));
        if (selectedTypes.length > 1) {
            throw new Error(`Multiple types found: ${selectedTypes.join(', ')}`);
        }
        this.type = selectedTypes[0] || '';

        const unprocessedWords = this.words.filter(word => !processedWords.has(word) && !this.ignoredWords.has(word));
        if (unprocessedWords.length > 0) {
            throw new Error(`Different words found: ${unprocessedWords.join(', ')}`);
        }

        return `${this.brand}-${this.type}-${this.description.join('-')}-${this.size}`
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}

export function extractProductKey(title: string): string {
    const normalized: string = normalizeString(title);
    const words: string[] = normalized.split(' ');
    const extractor = new ProductKeyExtractor(words);
    return extractor.extract();
}
