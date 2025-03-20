import { WordProcessor } from '../../../interfaces/WordProcessor';
import { ProductKeyExtractor } from '../ProductKeyExtractor';

export class WeightProcessor implements WordProcessor {
    constructor(private extractor: ProductKeyExtractor) {}

    process(word: string, index: number): void {
        const match = word.match(this.extractor.weightPattern);
        if (match) {
            const number = match[1];
            let unit = match[3] || '';
 
            if (!unit && index < this.extractor.words.length - 1) {
                const nextWord = this.extractor.words[index + 1];
                if (nextWord === 'quilo' || nextWord === 'quilos') {
                    unit = 'quilo';
                    this.extractor.words[index + 1] = '';
                }
            }
 
            if (unit) {
                const standardizedUnit = (unit === 'quilo' || unit === 'kg') ? 'kg' : unit;
                this.extractor.size = `${number}${standardizedUnit}`;
            }
        }
    }
}
