// js/RomajiOptions.js
import KanaConverter from './kana_converter.js';

// Function to generate romaji options for a given hiragana character
export function generateRomajiOptions(hiragana) {
    // Safety check: Make sure hiragana is a string
    if (typeof hiragana !== 'string') {
        console.error("Invalid hiragana provided to generateRomajiOptions. Expected a string, but got:", hiragana);
        return [];
    }

    let romajiOptions = [];

    // Get the correct romaji for the given hiragana character
    let correctRomaji = KanaConverter.toRomaji(hiragana);

    // Safety check: If no valid romaji is returned, retry or fallback
    if (!correctRomaji) {
        console.error(`Failed to convert hiragana '${hiragana}' to romaji. Skipping romaji generation.`);
        return [];
    }

    // Add the correct romaji to the options
    romajiOptions.push(correctRomaji);

    // Add distractor options, ensuring they are unique and not the same as the correct answer
    let attemptCounter = 0;  // To prevent infinite loops
    while (romajiOptions.length < 4) {  // Total of 4 options (including correct)
        attemptCounter++;
        const randomRomaji = KanaConverter.getRandomRomaji();

        // Safety check to ensure the random option is valid and unique
        if (randomRomaji && randomRomaji !== correctRomaji && !romajiOptions.includes(randomRomaji)) {
            romajiOptions.push(randomRomaji);
        }

        // Fallback if too many attempts are made
        if (attemptCounter > 10) {
            console.warn("Too many attempts to generate unique distractors. Using fallback distractors.");
            romajiOptions.push("fallback" + romajiOptions.length);  // Adding fallback distractors
        }
    }

    // Shuffle the options to randomize their positions
    for (let i = romajiOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [romajiOptions[i], romajiOptions[j]] = [romajiOptions[j], romajiOptions[i]];
    }

    // Log the generated options for debugging
    console.log("Generated romaji options (including correct answer):", romajiOptions);

    return romajiOptions;
}


// Function to draw the romaji options on the canvas
// Update the romaji options styling in drawRomajiOptions
export function drawRomajiOptions(ctx, canvas, romajiOptions, selectedOptionIndex) {
    const optionBoxWidth = canvas.width / 5;
    const optionBoxHeight = canvas.height / 10;
    const spacing = optionBoxWidth / 4;  // Reduced spacing
    const totalWidth = (optionBoxWidth + spacing) * romajiOptions.length - spacing;
    const startX = (canvas.width - totalWidth) / 2;
    const y = canvas.height - optionBoxHeight * 1.3;

    // Clear the entire bottom area
    ctx.clearRect(0, canvas.height - optionBoxHeight * 2, canvas.width, optionBoxHeight * 2);

    romajiOptions.forEach((option, index) => {
        const x = startX + index * (optionBoxWidth + spacing);

        // Shadow and button drawing
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;

        // Draw rounded rectangle
        ctx.beginPath();
        const radius = 12;
        ctx.roundRect(x, y, optionBoxWidth, optionBoxHeight, radius);

        if (selectedOptionIndex === index) {
            ctx.fillStyle = '#4A90E2';
        } else {
            ctx.fillStyle = '#FFFFFF';
        }
        ctx.fill();

        // Subtle border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Centered text
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = selectedOptionIndex === index ? '#FFFFFF' : '#333333';
        const textWidth = ctx.measureText(option).width;
        const textX = x + (optionBoxWidth - textWidth) / 2;
        const textY = y + optionBoxHeight / 2 + 8;
        ctx.fillText(option, textX, textY);

        ctx.restore();
    });
}