import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faMeh } from '@fortawesome/free-regular-svg-icons';
import './CardRating.css';

interface CardRatingProps {
  onRate: (rating: 'good' | 'okay' | 'bad') => void;
}

const CardRating: React.FC<CardRatingProps> = ({ onRate }) => {
  const handleIconClick = (rating: 'good' | 'okay' | 'bad') => (event: React.MouseEvent) => {
    event.stopPropagation();
    onRate(rating);
  };

  return (
    <div className="card-rating">
      <div className="icon got-it" onClick={handleIconClick('good')}>
        <FontAwesomeIcon icon={faThumbsUp} size="2x" />
      </div>
      <div className="icon kind-of" onClick={handleIconClick('okay')}>
        <FontAwesomeIcon icon={faMeh} size="2x" />
      </div>
      <div className="icon nope" onClick={handleIconClick('bad')}>
        <FontAwesomeIcon icon={faThumbsDown} size="2x" />
      </div>
    </div>
  );
};

export default CardRating;
