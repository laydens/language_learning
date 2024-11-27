import Theme from './Theme.js';

export default class GameOptions {
    constructor(ctx) {
        this.ctx = ctx;
        this.options = [];
        this.selectedOptionIndex = -1;
        this.hoveredIndex = -1;
        this.pressedIndex = -1;
        this.feedbackState = null; // { index: number, correct: boolean }
        this.feedbackStartTime = 0;
        this.lastFrameTime = 0;

        // Add mousemove listener here instead of in draw
        this.ctx.canvas.addEventListener('mousemove', (event) => {
            const rect = this.ctx.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Calculate option positions
            const optionBoxWidth = this.ctx.canvas.width / 5;
            const optionBoxHeight = this.ctx.canvas.height / 10;
            const spacing = optionBoxWidth / 4;
            const totalWidth = (optionBoxWidth + spacing) * this.options.length - spacing;
            const startX = (this.ctx.canvas.width - totalWidth) / 2;
            const y = this.ctx.canvas.height - optionBoxHeight * 1.3;

            this.hoveredIndex = -1; // Reset
            this.options.forEach((_, index) => {
                const x = startX + index * (optionBoxWidth + spacing);
                if (mouseX >= x && mouseX <= x + optionBoxWidth &&
                    mouseY >= y && mouseY <= y + optionBoxHeight) {
                    this.hoveredIndex = index;
                }
            });

            // Trigger redraw when hover state changes
            this.draw();
        });
    }

    generateOptions(character, dictionary) {
        const correctAnswer = dictionary[character];
        console.log('Generating options for character:', character);
        console.log('Correct answer:', correctAnswer);

        const allAnswers = new Set(Object.values(dictionary));
        const options = [correctAnswer];

        while (options.length < 4 && options.length < allAnswers.size) {
            const values = Array.from(allAnswers);
            const randomAnswer = values[Math.floor(Math.random() * values.length)];
            if (!options.includes(randomAnswer)) {
                options.push(randomAnswer);
            }
        }

        // Shuffle options
        this.options = options.sort(() => Math.random() - 0.5);
        console.log('Generated options:', this.options);
        this.draw();
    }

    draw(timestamp = performance.now()) {
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        const canvas = this.ctx.canvas;
        const optionBoxWidth = canvas.width / 5;
        const optionBoxHeight = canvas.height / 10;
        const spacing = optionBoxWidth / 4;
        const totalWidth = (optionBoxWidth + spacing) * this.options.length - spacing;
        const startX = (canvas.width - totalWidth) / 2;
        const y = canvas.height - optionBoxHeight * 1.3;

        // Use existing option size and shape
        const optionFontSize = Theme.getCanvasFontSize(Theme.fonts.sizes.character.medium, this.ctx.canvas);

        this.options.forEach((option, index) => {
            const x = startX + index * (optionBoxWidth + spacing);
            const isHovered = this.hoveredIndex === index;

            // Draw option background with more rounded corners
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.roundRect(x, y, optionBoxWidth, optionBoxHeight, 16); // Increased corner radius

            if (isHovered) {
                // Subtle hover effect
                this.ctx.fillStyle = Theme.colors.primary.pale;
                this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                this.ctx.shadowBlur = 8;
            } else {
                this.ctx.fillStyle = Theme.colors.surface.white;
            }

            this.ctx.fill();

            // Draw option text centered within the tile
            this.ctx.font = `${Theme.fonts.weights.medium} ${optionFontSize}px ${Theme.fonts.system.display}`;
            this.ctx.fillStyle = Theme.colors.text.primary;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(option, x + optionBoxWidth / 2, y + optionBoxHeight / 2);

            this.ctx.restore();
        });

        // Continue animation if needed
        if (this.feedbackState) {
            requestAnimationFrame(this.draw.bind(this));
        }
    }

    checkSelection(mouseX, mouseY) {
        const canvas = this.ctx.canvas;
        const optionBoxWidth = canvas.width / 5;
        const optionBoxHeight = canvas.height / 10;
        const spacing = optionBoxWidth / 4;
        const totalWidth = (optionBoxWidth + spacing) * this.options.length - spacing;
        const startX = (canvas.width - totalWidth) / 2;
        const y = canvas.height - optionBoxHeight * 1.3;

        let selectedOption = null;

        this.options.forEach((option, index) => {
            const x = startX + index * (optionBoxWidth + spacing);
            if (mouseX >= x && mouseX <= x + optionBoxWidth &&
                mouseY >= y && mouseY <= y + optionBoxHeight) {
                selectedOption = option;
                this.selectedOptionIndex = index;
                this.pressedIndex = index;
            }
        });

        if (selectedOption !== null) {
            this.draw();
            return selectedOption;
        }
        return null;
    }

    handleMouseMove(mouseX, mouseY) {
        const canvas = this.ctx.canvas;
        const optionBoxWidth = canvas.width / 5;
        const optionBoxHeight = canvas.height / 10;
        const spacing = optionBoxWidth / 4;
        const totalWidth = (optionBoxWidth + spacing) * this.options.length - spacing;
        const startX = (canvas.width - totalWidth) / 2;
        const y = canvas.height - optionBoxHeight * 1.3;

        let newHoveredIndex = -1;

        this.options.forEach((_, index) => {
            const x = startX + index * (optionBoxWidth + spacing);
            if (mouseX >= x && mouseX <= x + optionBoxWidth &&
                mouseY >= y && mouseY <= y + optionBoxHeight) {
                newHoveredIndex = index;
            }
        });

        if (newHoveredIndex !== this.hoveredIndex) {
            this.hoveredIndex = newHoveredIndex;
            this.draw();
        }
    }

    showFeedback(index, correct) {
        this.feedbackState = { index, correct };
        this.feedbackStartTime = performance.now();
        this.draw();
    }

    handleMouseUp() {
        this.pressedIndex = -1;
        this.selectedOptionIndex = -1;
        this.draw();
    }

    reset() {
        this.options = [];
        this.selectedOptionIndex = -1;
        this.hoveredIndex = -1;
        this.pressedIndex = -1;
        this.feedbackState = null;
    }
}