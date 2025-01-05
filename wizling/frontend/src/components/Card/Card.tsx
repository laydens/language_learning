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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import CardRating from './CardRating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'; // Flip icon
import './Card.css'; // Assuming you have a CSS file for styling
import { CARD_CONSTANTS } from './constants';
// import VocabDetailView from '../VocabDetail/VocabDetailView';
import JapaneseContent from './CardContent/JapaneseContent';
import JapaneseFlashcard from './models/JapaneseFlashcard';

interface CardProps {
    flashcard: JapaneseFlashcard;
    onRate?: (rating: 'good' | 'okay' | 'bad') => void;
    isActive?: boolean;
    isNext?: boolean;
    onShowDetail?: (vocabId: number) => void;
}

const Card: React.FC<CardProps> = ({ flashcard, onRate, isActive, isNext, onShowDetail }) => {
    console.log("Card component props:", { flashcard, isActive, isNext });
    const [isFlipped, setIsFlipped] = useState(false);
    const [frontFontSize, setFrontFontSize] = useState(CARD_CONSTANTS.MAX_FONT_SIZE);
    const [isContentReady, setIsContentReady] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const frontContentRef = useRef<HTMLDivElement>(null);
    const backContentRef = useRef<HTMLDivElement>(null);
    const vocabId = flashcard.id;

    const handleFlip = () => {
        if (isActive) {
            setIsFlipped(!isFlipped);
        }
    };

    const calculateFontSize = useCallback((content: React.ReactNode, isBackSide: boolean) => {
        const contentLength = content?.toString().length || 0;
        if (!cardRef.current) {
            return CARD_CONSTANTS.MAX_FONT_SIZE;
        }

        const cardWidth = cardRef.current.offsetWidth - (CARD_CONSTANTS.CONTENT_PADDING * 2);
        const cardHeight = cardRef.current.offsetHeight - (CARD_CONSTANTS.CONTENT_PADDING * 2);

        const widthBasedSize = cardWidth / Math.max(CARD_CONSTANTS.TARGET_CHARS_PER_LINE,
            Math.sqrt(contentLength));
        const heightBasedSize = cardHeight / Math.max(3, Math.ceil(contentLength / 15));
        const contentBasedSize = Math.sqrt((cardWidth * cardHeight) / (contentLength * 1.5));

        let optimalSize = Math.min(widthBasedSize, heightBasedSize, contentBasedSize);

        if (contentLength > 100) {
            optimalSize *= 0.8;
        }

        return Math.min(Math.max(optimalSize, CARD_CONSTANTS.MIN_FONT_SIZE),
            CARD_CONSTANTS.MAX_FONT_SIZE);
    }, []);

    useEffect(() => {
        if (isActive || isNext) {
            setIsContentReady(false);

            setTimeout(() => {
                if (!cardRef.current) return;

                const frontSize = calculateFontSize(flashcard.expression, false);
                const combinedBackContent = `${flashcard.reading}\n${flashcard.meanings.join(', ')}`;
                const backSize = calculateFontSize(combinedBackContent, true);
                setFrontFontSize(frontSize);

                setTimeout(() => {
                    setIsContentReady(true);
                }, 50);
            }, 50);
        }
    }, [isActive, isNext, flashcard.expression, flashcard.reading, flashcard.meanings, calculateFontSize]);

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onShowDetail && flashcard.id) {
            onShowDetail(flashcard.id);
        }
    };

    return (
        <>
            <div
                className={`card ${isActive ? 'active' : ''} ${isFlipped ? 'flipped' : ''} ${isContentReady ? 'content-ready' : ''}`}
                onClick={handleFlip}
            >
                <div className="card" ref={cardRef} style={{ position: 'relative' }}>
                    <div className="card-inner">
                        <div className="card-front" ref={frontContentRef}>
                            <div className="card-content" style={{ fontSize: frontFontSize }}>
                                <JapaneseContent
                                    expr={flashcard.expression}
                                    reading={flashcard.reading}
                                    meanings={Array.isArray(flashcard.meanings) ? flashcard.meanings : [flashcard.meanings]}
                                    isFront={isActive}
                                />
                            </div>
                        </div>
                        <div className="card-back" ref={backContentRef}>
                            {isFlipped && (
                                <button
                                    className="absolute top-3 right-3 text-surface-300 hover:text-surface-500 transition-colors duration-200 border-none outline-none bg-transparent"
                                    style={{
                                        opacity: 0.4,
                                        transform: 'translateZ(0)',
                                        padding: 0,
                                        margin: 0
                                    }}
                                    onClick={handleInfoClick}
                                >
                                    <FontAwesomeIcon
                                        icon={faCircleInfo}
                                        size="xl"
                                    />
                                </button>
                            )}
                            <JapaneseContent
                                expr={flashcard.expression}
                                reading={flashcard.reading}
                                meanings={Array.isArray(flashcard.meanings) ? flashcard.meanings : [flashcard.meanings]}
                                isFront={false}
                            />
                        </div>
                    </div>
                </div>
                {isFlipped && onRate && <CardRating onRate={onRate} />}
            </div>

            {/* {showDetail && vocabId ? (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={handleCloseModal}>&times;</button>
                        <VocabDetailView vocabId={vocabId} onClose={handleCloseModal} />
                    </div>
                </div>
            ) : (
                vocabId === undefined && console.log("vocabId is undefined, modal will not render")
            )} */}
        </>
    );
};

export default Card;
