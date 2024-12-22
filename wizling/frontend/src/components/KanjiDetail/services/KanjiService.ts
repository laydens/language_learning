export interface KanjiDetail {
    kanji: {
        id: string;
        char: string;
        onyomi: string;
        kunyomi: string;
        level: string;
    };
    meanings: Array<{
        entity_id: string;
        entity_type: string;
        meaning: string;
        context: string;
        usage_notes: string;
        lang_id: string;
        ord: string;
        pos: string;
    }>;
    common_compounds: Array<{
        entity_id: string;
        entity_type: string;
        compound: string;
        reading: string;
        meaning: string;
        frequency_level: string;
        lang_id: string;
    }>;
    examples: Array<{
        entity_id: string;
        entity_type: string;
        example: string;
        reading: string;
        trans: string;
        lang_id: string;
    }>;
}

export const getKanjiDetail = async (id: string): Promise<KanjiDetail> => {
    const response = await fetch(`/api/kanji/${id}`); // Adjust the API endpoint as needed
    if (!response.ok) {
        throw new Error('Failed to fetch kanji details');
    }
    return response.json();
}; 