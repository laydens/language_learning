// GameOptions.js
export default class GameOptions {
    constructor(ctx, colors, fonts) {
        this.ctx = ctx;
        this.colors = colors;
        this.fonts = fonts;
        this.options = [];
        this.selectedOptionIndex = -1;
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

    draw() {
        const canvas = this.ctx.canvas;
        const optionBoxWidth = canvas.width / 5;
        const optionBoxHeight = canvas.height / 10;
        const spacing = optionBoxWidth / 4;
        const totalWidth = (optionBoxWidth + spacing) * this.options.length - spacing;
        const startX = (canvas.width - totalWidth) / 2;
        const y = canvas.height - optionBoxHeight * 1.3;

        // Clear the option area
        this.ctx.clearRect(0, canvas.height - optionBoxHeight * 2, canvas.width, optionBoxHeight * 2);

        this.options.forEach((option, index) => {
            const x = startX + index * (optionBoxWidth + spacing);

            // Draw option box
            this.ctx.save();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetY = 3;

            this.ctx.beginPath();
            this.ctx.roundRect(x, y, optionBoxWidth, optionBoxHeight, 12);
            this.ctx.fillStyle = this.selectedOptionIndex === index ? this.colors.primary : '#FFFFFF';
            this.ctx.fill();

            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Draw option text
            this.ctx.font = `bold 24px ${this.fonts.primary}`;
            this.ctx.fillStyle = this.selectedOptionIndex === index ? '#FFFFFF' : '#333333';
            const textWidth = this.ctx.measureText(option).width;
            const textX = x + (optionBoxWidth - textWidth) / 2;
            const textY = y + optionBoxHeight / 2 + 8;
            this.ctx.fillText(option, textX, textY);

            this.ctx.restore();
        });
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
            }
        });

        if (selectedOption !== null) {
            this.draw();
            return selectedOption;  // Just return the selected option
        }
        return null;
    }


    handleMouseUp() {
        this.selectedOptionIndex = -1;
        this.draw();
    }

    reset() {
        this.options = [];
        this.selectedOptionIndex = -1;
    }
}