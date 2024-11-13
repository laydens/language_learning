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

        // Clear the option area
        //     this.ctx.clearRect(0, canvas.height - optionBoxHeight * 2, canvas.width, optionBoxHeight * 2);

        this.options.forEach((option, index) => {
            const x = startX + index * (optionBoxWidth + spacing);

            // Calculate visual states
            const isHovered = index === this.hoveredIndex;
            const isPressed = index === this.pressedIndex;
            const isSelected = index === this.selectedOptionIndex;

            // Dynamic elevation based on state
            let elevation = 3;  // Base elevation
            if (isHovered) elevation = 6;
            if (isPressed) elevation = 1;

            // Calculate feedback animation if active
            let feedbackOpacity = 0;
            let scale = 1;
            if (this.feedbackState && this.feedbackState.index === index) {
                const feedbackDuration = 500; // ms
                const elapsed = timestamp - this.feedbackStartTime;
                const progress = Math.min(elapsed / feedbackDuration, 1);

                feedbackOpacity = Math.sin(progress * Math.PI);
                scale = 1 + Math.sin(progress * Math.PI) * 0.05;

                if (progress >= 1) {
                    this.feedbackState = null;
                }
            }

            // Draw shadow layers for elevation
            this.ctx.save();
            for (let i = 0; i < elevation; i++) {
                this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                this.ctx.shadowBlur = 3 + i * 2;
                this.ctx.shadowOffsetY = 1 + i;
            }

            // Scale transform for feedback animation
            this.ctx.translate(x + optionBoxWidth / 2, y + optionBoxHeight / 2);
            this.ctx.scale(scale, scale);
            this.ctx.translate(-(x + optionBoxWidth / 2), -(y + optionBoxHeight / 2));

            // Draw option box
            this.ctx.beginPath();
            this.ctx.roundRect(x, y, optionBoxWidth, optionBoxHeight, 12);

            // Background color based on state
            if (this.feedbackState && this.feedbackState.index === index) {
                const feedbackColor = this.feedbackState.correct ?
                    Theme.colors.success.secondary :
                    Theme.colors.mistake.secondary;
                this.ctx.fillStyle = feedbackColor;
            } else if (isSelected || isPressed) {
                this.ctx.fillStyle = Theme.colors.primary.medium;
            } else if (isHovered) {
                this.ctx.fillStyle = Theme.colors.primary.pale;
            } else {
                this.ctx.fillStyle = '#FFFFFF';
            }
            this.ctx.fill();

            // Subtle border
            this.ctx.strokeStyle = isHovered ?
                Theme.colors.primary.medium :
                'rgba(0, 0, 0, 0.08)';
            this.ctx.lineWidth = isHovered ? 2 : 1;
            this.ctx.stroke();

            // Draw text
            this.ctx.font = `${Theme.fonts.weights.medium} ${Theme.fonts.sizes.ui.large} ${Theme.fonts.system.primary}`;
            this.ctx.fillStyle = isSelected || isPressed ?
                '#FFFFFF' :
                Theme.colors.text.primary;
            const textWidth = this.ctx.measureText(option).width;
            const textX = x + (optionBoxWidth - textWidth) / 2;
            const textY = y + optionBoxHeight / 2 + 8;
            this.ctx.fillText(option, textX, textY);

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