import React, { ReactNode } from 'react';
import './JapaneseContent.css';

interface JapaneseContentProps {
    expr?: ReactNode;
    reading?: ReactNode;
    meanings?: ReactNode[];
    isFront?: boolean;
}

const JapaneseContent: React.FC<JapaneseContentProps> = ({
    expr,
    reading,
    meanings = [],
    isFront = false
}) => {
    if (isFront) {
        return (
            <div className="jp-vocab">
                {expr}
            </div>
        );
    }

    return (
        <>


            <ul className="jp-back-content">
                <div className="jp-reading">{reading}</div>
                <div className="jp-line-separator"></div>
                {meanings.map((meaning, index) => (
                    <li key={index} className="jp-meaning">{meaning}</li>
                ))}
            </ul>
        </>
    );
};

export default JapaneseContent; 