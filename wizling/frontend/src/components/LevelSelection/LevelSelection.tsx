import React from 'react';
import { StudyLevel, PreferencesService } from '../../services/PreferencesService';
import './LevelSelection.css';

interface LevelSelectionProps {
    onLevelSelected: (level: StudyLevel) => void;
}

const LEVEL_DESCRIPTIONS = [
    {
        level: 'basic' as StudyLevel,
        jlpt: 'N5',
        title: 'Basic',
        description: 'Understanding of basic Japanese'
    },
    {
        level: 'elementary' as StudyLevel,
        jlpt: 'N4',
        title: 'Elementary',
        description: 'Understanding of basic Japanese in daily situations'
    },
    {
        level: 'intermediate' as StudyLevel,
        jlpt: 'N3',
        title: 'Intermediate',
        description: 'Understanding of Japanese used in everyday situations'
    },
    {
        level: 'pre-advanced' as StudyLevel,
        jlpt: 'N2',
        title: 'Pre-Advanced',
        description: 'Understanding of Japanese used in a broad range of situations'
    },
    {
        level: 'advanced' as StudyLevel,
        jlpt: 'N1',
        title: 'Advanced',
        description: 'Understanding of Japanese used in a variety of circumstances'
    }
];

const LevelSelection: React.FC<LevelSelectionProps> = ({ onLevelSelected }) => {
    const handleLevelSelect = (level: StudyLevel) => {
        PreferencesService.setStudyLevel(level);
        onLevelSelected(level);
    };

    return (
        <div className="level-selection-overlay">
            <div className="level-selection-modal">
                <div className="level-selection-content">
                    <h1>Let's get started</h1>
                    <p>How would you rate your Japanese level?</p>

                    <div className="level-buttons">
                        {LEVEL_DESCRIPTIONS.map(({ level, jlpt, title }) => (
                            <button
                                key={level}
                                onClick={() => handleLevelSelect(level)}
                                className="level-button"
                            >
                                <div className="level-button-content">
                                    <span className="level-title">{title}</span>
                                    <span className="jlpt-badge">{jlpt}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelSelection; 