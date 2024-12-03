/**
 * Content display component
 * Purpose: Renders card content with appropriate formatting
 * 
 * Requirements:
 * - Multiple content type support (text, HTML, markdown)
 * - Consistent typography system
 * - RTL language support
 * - WCAG 2.1 compliance
 * - Dynamic font sizing
 */

import React from 'react';

interface CardContentProps {
    type: 'text' | 'html' | 'markdown' | 'component';
    content: string;
}

const CardContent: React.FC<CardContentProps> = ({ type, content }) => {
    switch (type) {
        case 'text':
            return <p>{content}</p>;
        case 'html':
            return <div dangerouslySetInnerHTML={{ __html: content }} />;
        // Add more cases for 'markdown' and 'component' as needed
        default:
            return null;
    }
};

export default CardContent;
