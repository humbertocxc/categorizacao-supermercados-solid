import { WordProcessor } from '../../../interfaces/WordProcessor';
import { UnitStrategy } from '../../../interfaces/UnitStrategy';
import { ProductKeyExtractor } from '../ProductKeyExtractor';

class WeightUnitStrategy implements UnitStrategy {
    private unitMap: { [key: string]: string } = {
        'quilo': 'kg',
        'quilos': 'kg',
        'kg': 'kg',
        'grama': 'g',
        'gramas': 'g',
        'g': 'g'
    };

    standardize(unit: string): string {
        return this.unitMap[unit] || unit;
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
            let unit = match[2] || match[3] || '';

            if (!unit && index < this.extractor.words.length - 1) {
                const nextWord = this.extractor.words[index + 1];
                if (this.isWeightUnit(nextWord)) {
                    unit = nextWord;
                    this.extractor.words[index + 1] = '';
                }
            }

            if (unit) {
                const standardizedUnit = this.unitStrategy.standardize(unit);
                this.extractor.size = `${number}${standardizedUnit}`;
            }
        }
    }

    private isWeightUnit(word: string): boolean {
        return ['quilo', 'quilos', 'grama', 'gramas', 'kg', 'g'].includes(word);
    }
}
