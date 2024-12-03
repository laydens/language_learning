/**
 * Core card component
 * Purpose: Generic container for flashcard content with consistent styling
 * 
 * Requirements:
 * - Responsive, mobile-first design
 * - Clean, minimal aesthetics following Apple design principles
 * - Supports any content type (text, HTML, etc)
 * - Handles card state transitions
 * - Implements smooth animations
 */

import React, { useState, useEffect, useRef } from 'react';
import CardContent from './CardContent';
import CardRating from './CardRating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'; // Flip icon
import './Card.css'; // Assuming you have a CSS file for styling
import { CARD_CONSTANTS } from './constants';

interface CardProps {
    frontContent: string;
    backContent: string;
    onRate?: (rating: 'good' | 'okay' | 'bad') => void;
}

const Card: React.FC<CardProps> = ({ frontContent, backContent, onRate }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [fontSize, setFontSize] = useState(CARD_CONSTANTS.MAX_FONT_SIZE);
    const cardRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    useEffect(() => {
        const calculateOptimalFontSize = () => {
            if (!cardRef.current || !contentRef.current) return;

            const cardWidth = cardRef.current.offsetWidth - (CARD_CONSTANTS.CONTENT_PADDING * 2);
            const cardHeight = cardRef.current.offsetHeight - (CARD_CONSTANTS.CONTENT_PADDING * 2);
            const contentLength = contentRef.current.innerText.length;

            // Calculate font size based on width
            const widthBasedSize = cardWidth / CARD_CONSTANTS.TARGET_CHARS_PER_LINE;

            // Calculate font size based on content length
            const contentBasedSize = Math.sqrt((cardWidth * cardHeight) / contentLength);

            // Use the smaller of the two sizes
            let optimalSize = Math.min(widthBasedSize, contentBasedSize);

            // Clamp between min and max sizes
            optimalSize = Math.min(Math.max(optimalSize, CARD_CONSTANTS.MIN_FONT_SIZE),
                CARD_CONSTANTS.MAX_FONT_SIZE);

            setFontSize(optimalSize);
        };

        calculateOptimalFontSize();
        window.addEventListener('resize', calculateOptimalFontSize);
        return () => window.removeEventListener('resize', calculateOptimalFontSize);
    }, []);

    return (
        <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="card-inner">
                <div className="card-front" ref={contentRef} style={{ fontSize }}>
                    <CardContent type="text" content={frontContent} />
                </div>
                <div className="card-back" style={{ fontSize }}>
                    <CardContent type="text" content={backContent} />
                </div>
                <div className="flip-icon">
                    <FontAwesomeIcon icon={faSyncAlt} size="lg" />
                </div>
            </div>
            {/* Only show rating if the card is flipped */}
            {isFlipped && onRate && <CardRating onRate={onRate} />}
        </div>
    );
};

export default Card;
