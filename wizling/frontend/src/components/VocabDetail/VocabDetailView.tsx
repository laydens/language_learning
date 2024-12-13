import React, { useEffect, useState } from 'react';
import { BookOpen, Brain, Book, Building, MessageSquare, X } from 'lucide-react';
import { getVocabularyDetail, VocabularyDetail } from '../Card/services/FlashcardService';
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

  if (loading) return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 text-red-600">Error: {error}</div>
    </div>
  );

  if (!vocab) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 overflow-auto">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-500" />
          </button>
        )}

        {/* Header Section */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-4 flex-wrap pr-12">
              <h1 className="text-4xl font-bold text-gray-900">{vocab.expression}</h1>
              <div className="flex gap-2 text-2xl text-gray-600">
                <span>{vocab.reading}</span>
                <span className="text-gray-400">{vocab.romaji}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">{vocab.level}</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">{vocab.pos}</span>
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm">#{vocab.freq_rank}</span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-8">
          {/* Core Meanings */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ErrorBoundary>
                <BookOpen size={20} className="text-blue-600" />
              </ErrorBoundary>
              <h2 className="text-xl font-semibold text-gray-900">Core Meanings</h2>
            </div>
            {Array.isArray(vocab.meanings) && vocab.meanings.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2 pl-4">
                {vocab.meanings.map((meaning, index) => (
                  <li key={index} className="text-gray-700">
                    {typeof meaning.meaning === 'string' ? meaning.meaning : "No meaning available."}
                    {meaning.context && (
                      <span className="text-gray-500 ml-1">({meaning.context})</span>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-gray-500">No meanings available for this item.</div>
            )}
          </section>

          {/* Kanji Breakdown */}
          {Array.isArray(vocab.kanji_breakdown) && vocab.kanji_breakdown.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Book size={20} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Kanji Breakdown</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vocab.kanji_breakdown.map((kanji, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{kanji.character}</span>
                      <div>
                        <div className="font-medium text-gray-900">{kanji.meanings.join('; ')}</div>
                        <div className="text-sm text-gray-600">{kanji.readings.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Memory Hooks */}
          {Array.isArray(vocab.memory_hooks) && vocab.memory_hooks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Brain size={20} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Memory Hook</h2>
              </div>
              <div className="space-y-2">
                {vocab.memory_hooks.map((hook, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-gray-700">
                    {hook.hook}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Example Sentences */}
          {Array.isArray(vocab.examples) && vocab.examples.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={20} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Examples</h2>
              </div>
              <div className="space-y-4">
                {vocab.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-2 text-lg">{example.example}</div>
                    <div className="text-gray-600">{example.reading}</div>
                    <div className="text-gray-700 mt-2">{example.translation}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Terms */}
          {Array.isArray(vocab.related_terms) && vocab.related_terms.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Building size={20} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Related Terms</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vocab.related_terms.map((term, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-lg font-medium">{term.expression}</div>
                    <div className="text-gray-600">{term.reading}</div>
                    <div className="text-gray-700 mt-1">{term.meaning}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}