/**
 * FlashcardService
 * Handles fetching and formatting of flashcard content from the API.
 * Supports multiple content types through the FlashcardContentProvider system.
 * Currently implements Japanese language flashcards with potential for expansion.
 */

import Flashcard from '../models/JapaneseFlashcard';

const FLASHCARD_API_URL = process.env.REACT_APP_FLASHCARD_API_URL || 'http://127.0.0.1:8000/api/flashcards/';
const VOCAB_API_URL = process.env.VOCAB_API_URL || 'http://127.0.0.1:8000/api/japanese/vocab/';
/**
 * Fetches flashcards from the API and formats them according to the specified topic
 * @param numCards - Number of cards to fetch
 * @param level - Difficulty level
 * @param topic - Topic identifier (e.g., 'japanese')
 * @returns Promise<Flashcard[]> - Array of formatted flashcard content
 */
export const fetchFlashcards = async (
  numCards: number,
  level: string,
  topic: string = 'japanese'
): Promise<Flashcard[]> => {
  try {


    const response = await fetch(`${FLASHCARD_API_URL}?num_cards=${numCards}&level=${level}&topic=${topic}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    console.log("Raw API Data:", rawData);

    console.log("Before mapping rawData:", rawData);

    const formattedData = rawData.map((item: any) => {
      console.log("Mapping item:", item);
      return {
        id: item.id,
        expression: item.expression,
        reading: item.reading,
        meanings: item.meanings.map((meaning: any) => meaning.meaning),
        level: item.level
      };
    }) as Flashcard[];

    console.log("Formatted Flashcards:", formattedData);

    return formattedData;
  } catch (error) {
    console.error('[FlashcardService] Error:', error);
    throw error;
  }
};

export interface VocabularyDetail {
  id: number;
  expression: string;
  reading: string;
  romaji: string;
  level: string;
  freq_rank: number;
  pos: string;
  meanings: Array<{
    meaning: string;
    pos: string;
    context?: string;
    usage_notes?: string;
  }>;
  kanji_breakdown: Array<{
    character: string;
    meanings: string[];
    readings: string[];
  }>;
  memory_hooks: Array<{
    hook: string;
    category: string;
  }>;
  examples: Array<{
    example: string;
    reading: string;
    translation: string;
  }>;
  related_terms: Array<{
    expression: string;
    reading: string;
    meaning: string;
    frequency_level: string;
  }>;
}

export const getVocabularyDetail = async (vocabId: number): Promise<VocabularyDetail> => {
  try {
    const response = await fetch(`${VOCAB_API_URL}${vocabId}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[FlashcardService] Error fetching vocabulary detail:', error);
    throw error;
  }
}; 