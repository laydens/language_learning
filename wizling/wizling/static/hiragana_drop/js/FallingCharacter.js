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
        const baseScreenHeight = 800;
        const screenRatio = this.ctx.canvas.height / baseScreenHeight;
        this.speed = this.baseSpeed * screenRatio * 2; // Double the effect of speed


        // Ensure character stays within bounds
        this.x = Math.max(this.fontSize,
            Math.min(this.x, this.ctx.canvas.width - this.fontSize));
    }

    draw(isTarget = false) {
        if (!this.ctx) return;

        this.ctx.save();

        // Further increase base size for better visibility
        const baseSize = Theme.fonts.sizes.character.large + 20; // Increased from +12 to +20
        const scaleFactor = Math.max(
            this.ctx.canvas.width / 800,  // Adjusted base scale for larger size
            0.7  // Minimum 70% of base size
        );
        const characterFontSize = Math.round(baseSize * scaleFactor);

        this.ctx.font = `${Theme.fonts.weights.medium} ${characterFontSize}px ${Theme.fonts.japanese.primary}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        if (isTarget) {
            // Active character: orange with subtle white glow
            this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'; // Subtle white glow
            this.ctx.shadowBlur = 10; // Slightly diffuse
            this.ctx.fillStyle = Theme.colors.secondary.medium; // Crisp orange
        } else {
            this.ctx.fillStyle = Theme.colors.text.primary;
        }

        this.ctx.fillText(this.character, this.x, this.y);
        this.ctx.restore();
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