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
import { faSyncAlt, faEllipsisH, faCircleInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Flip icon
import './Card.css'; // Assuming you have a CSS file for styling
import { CARD_CONSTANTS } from './constants';
import VocabDetailView from '../VocabDetail/VocabDetailView';
import JapaneseContent from './CardContent/JapaneseContent';
import JapaneseFlashcard from './models/JapaneseFlashcard';

interface CardProps {
    flashcard: JapaneseFlashcard;
    onRate?: (rating: 'good' | 'okay' | 'bad') => void;
    isActive?: boolean;
    isNext?: boolean;
}

const Card: React.FC<CardProps> = ({ flashcard, onRate, isActive, isNext }) => {
    console.log("Card component props:", { flashcard, isActive, isNext });
    const [isFlipped, setIsFlipped] = useState(false);
    const [frontFontSize, setFrontFontSize] = useState(CARD_CONSTANTS.MAX_FONT_SIZE);
    const [backFontSize, setBackFontSize] = useState(CARD_CONSTANTS.MAX_FONT_SIZE);
    const [isContentReady, setIsContentReady] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const frontContentRef = useRef<HTMLDivElement>(null);
    const backContentRef = useRef<HTMLDivElement>(null);
    const [showDetail, setShowDetail] = useState(false);
    const vocabId = flashcard.id; // Assuming vocabId is a property of flashcard
    console.log({
        vocabId,
        isActive,
        isFlipped,
        shouldShowInfo: Boolean(vocabId && isActive && isFlipped),
        cardRef: cardRef.current,
        frontContentRef: frontContentRef.current,
        backContentRef: backContentRef.current
    });
    const handleFlip = () => {
        if (isActive) {
            setIsFlipped(!isFlipped);
        }
    };

    const calculateFontSize = useCallback((content: React.ReactNode, isBackSide: boolean) => {
        // Convert ReactNode to string length for calculation
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

        const finalSize = Math.min(Math.max(optimalSize, CARD_CONSTANTS.MIN_FONT_SIZE),
            CARD_CONSTANTS.MAX_FONT_SIZE);

        return finalSize;
    }, [isActive, isNext]);

    useEffect(() => {
        if (isActive || isNext) {
            // Reset content ready state
            setIsContentReady(false);

            // Calculate font sizes first
            setTimeout(() => {
                if (!cardRef.current) return;

                const frontSize = calculateFontSize(flashcard.expression, false);
                const combinedBackContent = `${flashcard.reading}\n${flashcard.meanings.join(', ')}`;
                const backSize = calculateFontSize(combinedBackContent, true);
                setFrontFontSize(frontSize);
                setBackFontSize(backSize);

                // After font sizes are set, trigger fade in
                setTimeout(() => {
                    setIsContentReady(true);
                }, 50);
            }, 50);
        }
    }, [isActive, isNext, flashcard.expression, flashcard.reading, flashcard.meanings]);

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
                                    meanings={Array.isArray(flashcard.meanings) ? flashcard.meanings : [flashcard.meanings]} // Ensure meanings is an array
                                    isFront={isActive} // Fixing the undefined 'isFront' by using 'isActive'
                                />
                            </div>
                        </div>
                        <div className="card-back" ref={backContentRef}>
                            {isFlipped && (
                                <button
                                    className="absolute top-3 right-3
                                               text-surface-300 hover:text-surface-500
                                               transition-colors duration-200
                                               border-none outline-none bg-transparent"
                                    style={{
                                        opacity: 0.4,
                                        transform: 'translateZ(0)',
                                        padding: 0,
                                        margin: 0
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Circle info button clicked");
                                        setShowDetail(true);
                                    }}
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
                                meanings={Array.isArray(flashcard.meanings) ? flashcard.meanings : [flashcard.meanings]} // Ensure meanings is an array
                                isFront={false} // Fixing the undefined 'isFront' by using 'isActive'
                            />
                        </div>
                    </div>
                </div>
                {isFlipped && onRate && <CardRating onRate={onRate} />}
            </div>

            {showDetail && vocabId ? (
                <div className="modal" onClick={() => {
                    console.log("Modal background clicked, closing modal");
                    setShowDetail(false);
                }}>
                    <div className="modal-content" onClick={e => {
                        e.stopPropagation();
                        console.log("Modal content clicked, preventing close");
                    }}>
                        <VocabDetailView vocabId={vocabId} onClose={() => {
                            console.log("VocabDetailView closed");
                            setShowDetail(false);
                        }} />
                    </div>
                </div>
            ) : (
                vocabId === undefined && console.log("vocabId is undefined, modal will not render")
            )}
        </>
    );
};

export default Card;
