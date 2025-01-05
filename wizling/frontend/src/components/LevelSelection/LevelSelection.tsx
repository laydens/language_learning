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
        description: 'Essential Japanese',
        examples: '私 (I) • 本 (book) • 食べる (eat)'
    },
    {
        level: 'elementary' as StudyLevel,
        jlpt: 'N4',
        title: 'Elementary',
        description: 'Basic daily Japanese',
        examples: '約束 (promise) • 親切 (kind) • 決める (decide)'
    },
    {
        level: 'intermediate' as StudyLevel,
        jlpt: 'N3',
        title: 'Intermediate',
        description: 'Everyday Japanese',
        examples: '我慢 (patience) • 工夫 (devise) • 募集 (recruit)'
    },
    {
        level: 'pre-advanced' as StudyLevel,
        jlpt: 'N2',
        title: 'Pre-Advanced',
        description: 'Broad practical Japanese',
        examples: '把握 (grasp) • 該当 (correspond) • 充実 (fulfilling)'
    },
    {
        level: 'advanced' as StudyLevel,
        jlpt: 'N1',
        title: 'Advanced',
        description: 'Complex Japanese',
        examples: '憂慮 (anxiety) • 瑕疵 (defect) • 頓挫 (stagnate)'
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
                    <h3>What's your Japanese level?</h3>

                    <div className="level-buttons">
                        {LEVEL_DESCRIPTIONS.map(({ level, jlpt, title, description, examples }) => (
                            <button
                                key={level}
                                onClick={() => handleLevelSelect(level)}
                                className="level-button"
                            >
                                <div className="level-button-content">
                                    <div className="level-main">
                                        <span className="level-title">{title}</span>
                                        <span className="jlpt-badge">{jlpt}</span>
                                    </div>
                                    <div className="level-details">
                                        <span className="level-description">{description}</span>
                                        <span className="level-examples">{examples}</span>
                                    </div>
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