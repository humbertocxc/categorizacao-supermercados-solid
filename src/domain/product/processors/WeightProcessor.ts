import { WordProcessor } from '../../../interfaces/WordProcessor';
import { UnitStrategy } from '../../../interfaces/UnitStrategy';
import { ProductKeyExtractor } from '../ProductKeyExtractor';

class WeightUnitStrategy implements UnitStrategy {
    private unitConversion: { [key: string]: number } = {
        'quilo': 1000,
        'quilos': 1000,
        'kg': 1000,
        'grama': 1,
        'gramas': 1,
        'g': 1
    };

    standardize(unit: string, number: string): string {
        const num = parseInt(number, 10);
        const grams = this.unitConversion[unit] ? num * this.unitConversion[unit] : num;
        return `${grams}g`;
    }
}

export class WeightProcessor implements WordProcessor {
    private unitStrategy: UnitStrategy;

    constructor(private extractor: ProductKeyExtractor) {
        this.unitStrategy = new WeightUnitStrategy();
    }

    process(word: string, index: number): void {
        const match = word.match(this.extractor.weightPattern);
        if (match) {
            const number = match[1];
            let unit = match[2] || '';

            if (!unit && index < this.extractor.words.length - 1) {
                const nextWord = this.extractor.words[index + 1];
                if (this.isWeightUnit(nextWord)) {
                    unit = nextWord;
                    this.extractor.words[index + 1] = '';
                }
            }

            if (unit) {
                this.extractor.size = this.unitStrategy.standardize(unit, number);
            }
        }
    }

    private isWeightUnit(word: string): boolean {
        return ['quilo', 'quilos', 'grama', 'gramas', 'kg', 'g'].includes(word);
    }
}
