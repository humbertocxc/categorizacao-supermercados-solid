import * as fs from 'fs';

export class FileManager {
    readFile(filePath: string): string {
        return fs.readFileSync(filePath, 'utf8');
    }

    writeFile(filePath: string, data: string): void {
        fs.writeFileSync(filePath, data, 'utf8');
    }
}
