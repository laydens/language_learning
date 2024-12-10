import { ReactNode } from 'react';
import Flashcard from '../models/JapaneseFlashcard';

export interface ContentFormatter {
    formatAPIResponse(apiData: any): Flashcard;
    formatFrontContent(data: any): ReactNode;
    formatBackContent(data: any): ReactNode;
    injectStyles?(): void;
}

export default class FlashcardContentProvider {
    private static formatters: Map<string, ContentFormatter> = new Map();
    front_content: any;
    back_content: any;
    id: any;

    static registerFormatter(type: string, formatter: ContentFormatter): void {
        this.formatters.set(type, formatter);
        formatter.injectStyles?.();
    }

    static getFormatter(type: string): ContentFormatter {
        const formatter = this.formatters.get(type);
        if (!formatter) {
            throw new Error(`No formatter registered for type: ${type}`);
        }
        return formatter;
    }

    static formatContent(type: string, apiData: any): Flashcard {
        const formatter = this.getFormatter(type);
        const formattedData = formatter.formatAPIResponse(apiData);

        return formattedData;
    }
}

