export interface UnitStrategy {
    standardize(unit: string, value: string): string;
}
