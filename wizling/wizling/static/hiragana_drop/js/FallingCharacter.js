import Theme from './Theme.js';
// js/Character.js
export default class FallingCharacter {
    constructor(character, x, speed, ctx) {
        this.character = character;
        this.x = x;
        this.y = 0;
        this.speed = speed;
        this.ctx = ctx;
        this.lastUpdate = performance.now();

        // Add responsive positioning
        this.baseSpeed = speed;
        this.updateDimensions();
    }

    updateDimensions() {
        const canvasWidth = this.ctx.canvas.width;

        // Base size calculation
        let scaleFactor;
        if (canvasWidth < 480) {
            // Small screens - larger relative size
            scaleFactor = 0.15; // 15% of width
        } else if (canvasWidth < 768) {
            // Medium screens
            scaleFactor = 0.12; // 12% of width
        } else {
            // Large screens
            scaleFactor = 0.08; // 8% of width
        }

        // Set minimum and maximum sizes
        const minSize = 40;  // Minimum readable size
        const maxSize = 120; // Maximum size

        // Calculate and constrain font size
        this.fontSize = Math.floor(Math.min(maxSize,
            Math.max(minSize, canvasWidth * scaleFactor)));

        // Adjust speed based on screen height
        this.speed = this.baseSpeed * (this.ctx.canvas.height / 800);

        // Ensure character stays within bounds
        this.x = Math.max(this.fontSize,
            Math.min(this.x, this.ctx.canvas.width - this.fontSize));
    }

    draw(isActive = false) {
        // Update dimensions before drawing
        this.updateDimensions();

        this.ctx.font = `${this.fontSize}px ${Theme.fonts.japanese.primary}`;

        this.ctx.fillStyle = isActive ?
            Theme.colors.secondary.medium :
            Theme.colors.primary.medium;

        // Center the character horizontally
        const metrics = this.ctx.measureText(this.character);
        const drawX = this.x - (metrics.width / 2);

        this.ctx.fillText(this.character, drawX, this.y);

        // Reset shadow
        if (isActive) {
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
        }
    }

    update() {
        const now = performance.now();
        const deltaTime = (now - this.lastUpdate) / 16.67; // normalize to 60fps

        // Update position
        this.y += this.speed * deltaTime;
        this.lastUpdate = now;

        // Add slight horizontal drift for visual interest
        this.x += Math.sin(now * Theme.game.characters.drift.speed) *
            Theme.game.characters.drift.amplitude * (deltaTime / 60);

        // Keep character within bounds
        const margin = this.fontSize / 2;
        this.x = Math.max(margin,
            Math.min(this.x, this.ctx.canvas.width - margin));
    }
}