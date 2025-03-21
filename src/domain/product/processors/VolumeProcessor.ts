import { WordProcessor } from '../../../interfaces/WordProcessor';
import { UnitStrategy } from '../../../interfaces/UnitStrategy';
import { ProductKeyExtractor } from '../ProductKeyExtractor';

class VolumeUnitStrategy implements UnitStrategy {
    private unitMap: { [key: string]: string } = {
        'litro': 'l',
        'litros': 'l',
        'l': 'l',
        'mililitro': 'ml',
        'mililitros': 'ml',
        'ml': 'ml'
    };

    standardize(unit: string): string {
        return this.unitMap[unit] || unit;
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
            let unit = match[2] || match[3] || '';

            if (!unit && index < this.extractor.words.length - 1) {
                const nextWord = this.extractor.words[index + 1];
                if (this.isVolumeUnit(nextWord)) {
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

    private isVolumeUnit(word: string): boolean {
        return ['litro', 'litros', 'mililitro', 'mililitros', 'l', 'ml'].includes(word);
    }
}
