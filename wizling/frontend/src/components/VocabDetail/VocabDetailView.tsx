import React, { useEffect, useState } from 'react';
import { Network, ScanText, BookOpen, Brain, Book, Building, MessageSquare } from 'lucide-react';
import { getVocabularyDetail, VocabularyDetail } from '../Card/services/FlashcardService';
import styles from './VocabDetail.module.css';
import ErrorBoundary from '../ErrorBoundary';

interface VocabDetailViewProps {
  vocabId: number;
  onClose?: () => void;
}

export default function VocabDetailView({ vocabId, onClose }: VocabDetailViewProps) {
  const [vocab, setVocab] = useState<VocabularyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVocabDetail = async () => {
      try {
        const detail = await getVocabularyDetail(vocabId);
        setVocab(detail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vocabulary details');
      } finally {
        setLoading(false);
      }
    };

    loadVocabDetail();
  }, [vocabId]);

  if (loading) return <div className={styles.vocabDetailLoading}>Loading...</div>;
  if (error) return <div className={styles.vocabDetailError}>Error: {error}</div>;
  if (!vocab) return null;

  return (
    <div className={styles.vocabDetail}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>{vocab.expression}</h1>
          <div className={styles.readings}>
            <span className={styles.reading}>{vocab.reading}</span>
            <span className={styles.romaji}>{vocab.romaji}</span>
          </div>
        </div>
        <div className={styles.meta}>
          <span>{vocab.level}</span>
          <span>{vocab.pos}</span>
          <span>#{vocab.freq_rank}</span>
        </div>
      </div>

      <div className={styles.vocabSection}>
        <div className={styles.sectionHeader}>
          <ErrorBoundary>
            <BookOpen className={styles.sectionIcon} size={18} />
          </ErrorBoundary>
          <h2>Core Meanings</h2>
        </div>
        {Array.isArray(vocab.meanings) && vocab.meanings.length > 0 ? (
          <ol className={styles.meaningsList}>
            {vocab.meanings.map((meaning, index) => (
              <li key={index}>
                {typeof meaning.meaning === 'string' ? meaning.meaning : "No meaning available."}
                {meaning.context && (
                  <span className={styles.context}>({meaning.context})</span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.noContent}>No meanings available for this item.</div>
        )}
      </div>

      {Array.isArray(vocab.kanji_breakdown) && vocab.kanji_breakdown.length > 0 && (
        <div className={styles.vocabSection}>
          <div className={styles.sectionHeader}>
            <ScanText className={styles.sectionIcon} size={18} />
            <h2>Kanji Breakdown</h2>
          </div>
          <div className={styles.kanjiGrid}>
            {vocab.kanji_breakdown.map((kanji, index) => (
              <div key={index} className={styles.kanjiItem}>
                <span className={styles.kanjiChar}>{kanji.character}</span>
                <div className={styles.kanjiDetails}>
                  <div className={styles.kanjiMeanings}>{kanji.meanings.join('; ')}</div>
                  <div className={styles.kanjiReadings}>{kanji.readings.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(vocab.memory_hooks) && vocab.memory_hooks.length > 0 && (
        <div className={styles.vocabSection}>
          <div className={styles.sectionHeader}>
            <Brain className={styles.sectionIcon} size={18} />
            <h2>Memory Hook</h2>
          </div>
          <div className={styles.memoryHooksList}>
            {vocab.memory_hooks.map((hook, index) => (
              <div key={index} className={styles.memoryHook}>
                {hook.hook}
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(vocab.examples) && vocab.examples.length > 0 && (
        <div className={styles.vocabSection}>
          <div className={styles.sectionHeader}>
            <MessageSquare className={styles.sectionIcon} size={18} />
            <h2>Examples</h2>
          </div>
          <div className={styles.examplesList}>
            {vocab.examples.map((example, index) => (
              <div key={index} className={styles.exampleItem}>
                <div className={styles.exampleJapanese}>{example.example}</div>
                <div className={styles.exampleReading}>{example.reading}</div>
                <div className={styles.exampleTranslation}>{example.translation}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(vocab.related_terms) && vocab.related_terms.length > 0 && (
        <div className={styles.vocabSection}>
          <div className={styles.sectionHeader}>
            <Network className={styles.sectionIcon} size={18} />
            <h2>Related Terms</h2>
          </div>
          <div className={styles.termsGrid}>
            {vocab.related_terms.map((term, index) => (
              <div key={index} className={styles.termItem}>
                <div className={styles.termExpression}>{term.expression}</div>
                <div className={styles.termReading}>{term.reading}</div>
                <div className={styles.termMeaning}>{term.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}