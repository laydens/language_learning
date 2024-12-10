import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown, faFaceMeh, faFaceSmile } from '@fortawesome/free-regular-svg-icons';
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
      <div className="rating-item">
        <div className="icon nope" onClick={handleIconClick('bad')}>
          <FontAwesomeIcon icon={faFaceFrown} size="2x" />
        </div>
        <span className="rating-label">Didn't know</span>
      </div>
      <div className="rating-item">
        <div className="icon kind-of" onClick={handleIconClick('okay')}>
          <FontAwesomeIcon icon={faFaceMeh} size="2x" />
        </div>
        <span className="rating-label">Partial</span>
      </div>
      <div className="rating-item">
        <div className="icon got-it" onClick={handleIconClick('good')}>
          <FontAwesomeIcon icon={faFaceSmile} size="2x" />
        </div>
        <span className="rating-label">Got it</span>
      </div>
    </div>
  );
};

export default CardRating;
