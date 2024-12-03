import React, { useState, useRef } from 'react';
import Card from './Card';
import './CardDeck.css';

interface CardData {
  frontContent: string;
  backContent: string;
}

interface CardDeckProps {
  cards?: CardData[];
}

const CardDeck: React.FC<CardDeckProps> = ({
  cards = [
    { frontContent: "Example 1", backContent: "Answer 1" },
    { frontContent: "Example 2", backContent: "Answer 2" },
    { frontContent: "Example 3", backContent: "Answer 3" },
    { frontContent: "Example 4", backContent: "Answer 4" },
    { frontContent: "Example 5", backContent: "Answer 5" },
  ]
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const currentCardRef = useRef<HTMLDivElement>(null);
  const nextCardRef = useRef<HTMLDivElement>(null);

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
      setNextIndex((nextIndex + 1) % cards.length);

      // Reset positions for next transition
      if (currentCard && nextCard) {
        currentCard.style.transition = 'none';
        nextCard.style.transition = 'none';

        // Reset current card to center
        currentCard.style.transform = 'translate(-50%, 0)';
        // Reset next card to starting position
        nextCard.style.transform = 'translate(-200%, 0)';
      }

      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="card-deck" style={{ position: 'relative', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Current card with exit animation */}
      <div
        className="current-card-wrapper"
        ref={currentCardRef}
        style={{ transform: 'translate(-50%, 0)' }} // Center the current card
      >
        <Card
          key={currentIndex}
          frontContent={cards[currentIndex].frontContent}
          backContent={cards[currentIndex].backContent}
          onRate={handleExit} // Trigger exit on rating
        />
      </div>

      {/* Next card, initially off-screen to the left */}
      <div
        className="next-card-wrapper"
        ref={nextCardRef}
        style={{ transform: 'translate(-200%, 0)' }} // Start completely off-screen to the left
      >
        <Card
          key={nextIndex}
          frontContent={cards[nextIndex].frontContent}
          backContent={cards[nextIndex].backContent}
          onRate={handleExit} // Ensure the next card also has the rating functionality
        />
      </div>
    </div>
  );
};

export default CardDeck;
