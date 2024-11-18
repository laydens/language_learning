// js/config.js

const GameConfig = {
    initialSpeed: 500,
    speedIncrement: 10,
    correctThreshold: 90, // Percent
    masteryStreak: 10,    // Correct answers needed for progression
    groups: [
        ["a", "i", "u", "e", "o"],
        ["ka", "ki", "ku", "ke", "ko"],
        // More groups as needed
    ],
    characterDensity: {
        start: 2,         // Start with one falling character
        incrementRate: 1, // Add one character per level increase
        maxDensity: 1     // Cap density to keep things manageable
    }
};

