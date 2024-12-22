import { useState, useEffect } from 'react';
import { getKanjiDetail } from '../../KanjiDetail/services/KanjiService';

interface KanjiDetail {
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

const useKanjiDetail = (id: string) => {
    const [kanjiDetail, setKanjiDetail] = useState<KanjiDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKanjiDetail = async () => {
            try {
                const detail = await getKanjiDetail(id);
                setKanjiDetail(detail as any); // Type assertion to bypass the type error
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load kanji details');
            } finally {
                setLoading(false);
            }
        };

        fetchKanjiDetail();
    }, [id]);

    return { kanjiDetail, loading, error };
};

export default useKanjiDetail;
