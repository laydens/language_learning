import { useEffect, useState } from 'react';
import { fetchFlashcards } from '../services/FlashcardService';
import Flashcard from '../models/JapaneseFlashcard';
import { StudyLevel } from '../../../services/PreferencesService';

const useFlashcards = (numCards: number, level: StudyLevel) => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFlashcards = async () => {
            try {
                const rawData = await fetchFlashcards(numCards, level);
                console.log("Raw API Data:", rawData);

                const formattedData = rawData.map((item: any) => {
                    return {
                        id: item.id,
                        expression: item.expression,
                        reading: item.reading,
                        meanings: item.meanings,
                        level: item.level
                    };
                }) as Flashcard[];

                setFlashcards(formattedData);
            } catch (error) {
                console.error('[FlashcardService] Error:', error);
                setError('Failed to load flashcards');
            } finally {
                setLoading(false);
            }
        };

        loadFlashcards();
    }, [numCards, level]);

    return { flashcards, loading, error };
};

export default useFlashcards; 