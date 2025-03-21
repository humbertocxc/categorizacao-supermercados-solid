import { WordProcessor } from '../../interfaces/WordProcessor';
import { WeightProcessor } from './processors/WeightProcessor';
import { VolumeProcessor } from './processors/VolumeProcessor';
import { normalizeString } from '../../utils/stringUtils';

export class ProductKeyExtractor {
    public weightPattern: RegExp = /(\d+)\s*(kg|g|quilo|quilos|grama|gramas)?/i;
    public volumePattern: RegExp = /(\d+)\s*(l|litro|litros|ml|mililitro|mililitros)?/i;
    public ignoredWords: Set<string> = new Set(['tipo']);
    public size: string = '';
    public significantWords: Set<string> = new Set();
    private processors: WordProcessor[];

    constructor(public words: string[]) {
        this.processors = [
            new WeightProcessor(this),
            new VolumeProcessor(this)
        ];
    }

    public extract(): string {
        const processedWords = new Set<string>();

        this.words.forEach((word: string, index: number) => {
            if (!this.ignoredWords.has(word) && !processedWords.has(word)) {
                const isWeightOrVolume = this.weightPattern.test(word) || this.volumePattern.test(word);
                this.processors.forEach(processor => processor.process(word, index));
                if (!isWeightOrVolume && (!this.size || !this.size.startsWith(word))) {
                    this.significantWords.add(word);
                }
                processedWords.add(word);
            }
        });

        return `${Array.from(this.significantWords).sort().join('-')}-${this.size}`
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
