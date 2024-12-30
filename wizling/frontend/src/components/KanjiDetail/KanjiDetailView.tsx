import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useKanjiDetail from '../shared/hooks/useKanjiDetail'; // Custom hook for fetching kanji details
import styles from './KanjiDetail.module.css';

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

const KanjiDetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { kanjiDetail, loading, error } = useKanjiDetail(id!);

    const handleBack = () => {
        navigate(-1); // Go back to the previous page (Vocab Detail View)
    };

    const handleClose = () => {
        navigate('/flashcard-game'); // Navigate to the Flashcards view
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!kanjiDetail) return null;

    return (
        <div className={styles.kanjiDetail}>
            <div className={styles.navigation}>
                <button onClick={handleBack} className={styles.backButton}>Back</button>
                <button onClick={handleClose} className={styles.closeButton}>X</button>
            </div>
            <h1>{kanjiDetail.kanji.char} (ID: {kanjiDetail.kanji.id})</h1>
            <p>Onyomi: {kanjiDetail.kanji.onyomi}</p>
            <p>Kunyomi: {kanjiDetail.kanji.kunyomi}</p>
            <p>Level: {kanjiDetail.kanji.level}</p>

            <h2>Meanings</h2>
            <ul>
                {kanjiDetail.meanings.map((meaning) => (
                    <li key={meaning.entity_id}>
                        {meaning.meaning} ({meaning.context}) - {meaning.pos}
                    </li>
                ))}
            </ul>

            <h2>Common Compounds</h2>
            <ul>
                {kanjiDetail.common_compounds.map((compound) => (
                    <li key={compound.entity_id}>
                        {compound.compound} ({compound.reading}): {compound.meaning}
                    </li>
                ))}
            </ul>

            <h2>Examples</h2>
            <ul>
                {kanjiDetail.examples.map((example) => (
                    <li key={example.entity_id}>
                        <p>{example.example} ({example.reading})</p>
                        <p>Translation: {example.trans}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KanjiDetailView; 