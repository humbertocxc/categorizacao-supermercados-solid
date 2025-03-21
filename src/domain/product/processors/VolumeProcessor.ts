import { WordProcessor } from '../../../interfaces/WordProcessor';
import { UnitStrategy } from '../../../interfaces/UnitStrategy';
import { ProductKeyExtractor } from '../ProductKeyExtractor';

class VolumeUnitStrategy implements UnitStrategy {
    private unitConversion: { [key: string]: number } = {
        'litro': 1000,
        'litros': 1000,
        'l': 1000,
        'mililitro': 1,
        'mililitros': 1,
        'ml': 1
    };

    standardize(unit: string, number: string): string {
        const num = parseInt(number, 10);
        const milliliters = this.unitConversion[unit] ? num * this.unitConversion[unit] : num;
        return `${milliliters}ml`;
    }
}

export class VolumeProcessor implements WordProcessor {
    private unitStrategy: UnitStrategy;

    constructor(private extractor: ProductKeyExtractor) {
        this.unitStrategy = new VolumeUnitStrategy();
    }

    process(word: string, index: number): void {
        const match = word.match(this.extractor.volumePattern);
        if (match) {
            const number = match[1];
            let unit = match[2] || '';

            if (!unit && index < this.extractor.words.length - 1) {
                const nextWord = this.extractor.words[index + 1];
                if (this.isVolumeUnit(nextWord)) {
                    unit = nextWord;
                    this.extractor.words[index + 1] = '';
                }
            }

            if (unit) {
                this.extractor.size = this.unitStrategy.standardize(unit, number);
            }
        }
    }

    private isVolumeUnit(word: string): boolean {
        return ['litro', 'litros', 'mililitro', 'mililitros', 'l', 'ml'].includes(word);
    }
}
