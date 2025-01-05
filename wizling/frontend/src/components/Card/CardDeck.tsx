import React, { useState, useRef } from 'react';
import Card from './Card';
import './CardDeck.css';
import useFlashcards from './hooks/UseFlashcards';
import FlashcardContent from './providers/FlashcardContentProvider';
import JapaneseFlashcard from './models/JapaneseFlashcard';
import VocabDetailView from '../VocabDetail/VocabDetailView';
import { X } from 'lucide-react';
import LevelSelection from '../LevelSelection/LevelSelection';
import { PreferencesService, StudyLevel } from '../../services/PreferencesService';

// Move the interface to a separate types file or export it here
export interface CardData {
  expression: string;
  reading: string;
  meanings: string[];
  id?: number;
}

interface CardDeckProps {
  cards?: CardData[];
  numCards?: number;
  level?: string;
}

const CardDeck: React.FC<CardDeckProps> = ({
  cards,
  numCards = 5,
  level: propLevel
}) => {
  const [selectedLevel, setSelectedLevel] = useState<StudyLevel | null>(
    propLevel as StudyLevel || PreferencesService.getStudyLevel()
  );

  const { flashcards, loading, error } = useFlashcards(numCards, selectedLevel as StudyLevel);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedVocabId, setSelectedVocabId] = useState<number | null>(null);
  const currentCardRef = useRef<HTMLDivElement>(null);
  const nextCardRef = useRef<HTMLDivElement>(null);

  // Handle case where level isn't selected
  if (!selectedLevel) {
    return <LevelSelection onLevelSelected={setSelectedLevel} />;
  }

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  const displayCards = cards || flashcards.map(flashcard => ({
    expression: flashcard.expression,
    reading: flashcard.reading,
    meanings: flashcard.meanings,
    id: flashcard.id
  }));

  const handleExit = () => {
    if (isAnimating) return; // Prevent multiple animations
    setIsAnimating(true);

    // Animate the current card out
    const currentCard = currentCardRef.current;
    const nextCard = nextCardRef.current;

    if (currentCard && nextCard) {
      // Move current card off to the right
      currentCard.style.transition = 'transform 0.5s ease-out';
      currentCard.style.transform = 'translate(100%, 0)';

      // Move next card to center
      nextCard.style.transition = 'transform 0.5s ease-out';
      nextCard.style.transform = 'translate(-50%, 0)';
    }

    // Wait for the animation to complete
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setNextIndex((nextIndex + 1) % displayCards.length);

      // Reset positions for next transition
      if (currentCard && nextCard) {
        currentCard.style.transition = 'none';
        nextCard.style.transition = 'none';

        // Reset current card to center
        currentCard.style.transform = 'translate(-50%, 0)';
        // Reset next card to starting position
        nextCard.style.transform = 'translate(-300%, 0)';
      }

      setIsAnimating(false);
    }, 300);
  };

  const handleShowDetail = (vocabId: number) => {
    setSelectedVocabId(vocabId);
    setShowDetail(true);
    // Optionally pause any ongoing animations or timers
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedVocabId(null);
  };

  return (
    <>
      <div className="card-deck">
        {/* Current card */}
        <div className="current-card-wrapper" ref={currentCardRef} style={{ transform: 'translate(-50%, 0)' }}>
          <Card
            key={`current-${currentIndex}`}
            flashcard={displayCards[currentIndex] as JapaneseFlashcard}
            onRate={handleExit}
            isActive={true}
            isNext={false}
            onShowDetail={handleShowDetail}
          />
        </div>

        {/* Next card (pre-loaded) */}
        <div className="next-card-wrapper" ref={nextCardRef} style={{ transform: 'translate(-300%, 0)' }}>
          <>
            {console.log("Next Card vocabId:", displayCards[nextIndex].id)}
            <Card
              flashcard={displayCards[nextIndex] as JapaneseFlashcard}
              onRate={handleExit}
              isActive={false}
              isNext={true}
              onShowDetail={handleShowDetail}
            />
          </>
        </div>
      </div>

      {/* Detail View Modal */}
      {showDetail && selectedVocabId && (
        <div className="detail-view-overlay">
          <div className="detail-view-container">
            <button
              className="detail-view-close"
              onClick={handleCloseDetail}
              aria-label="Close detail view"
            >
              <X size={24} />
            </button>
            <div className="detail-view-content">
              <VocabDetailView
                vocabId={selectedVocabId}
                onClose={handleCloseDetail}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardDeck;
