// js/Character.js
export default class FallingCharacter {
    constructor(character, x, speed, ctx) {
        console.log("Creating new character with speed:", speed);
        this.character = character;
        this.x = x;
        this.y = 0;
        this.speed = speed;
        this.ctx = ctx;
        this.lastUpdate = performance.now();
    }

    draw(isActive = false) {
        this.ctx.font = `${0.06 * this.ctx.canvas.width}px Arial`;
        this.ctx.fillStyle = isActive ? '#ff0000' : '#000';
        this.ctx.fillText(this.character, this.x, this.y);
    }

    update() {
        const now = performance.now();
        const deltaTime = (now - this.lastUpdate) / 16.67;  // normalize to 60fps
        this.y += this.speed * deltaTime;
        this.lastUpdate = now;

        // Debug log
        if (Math.floor(this.y) % 100 === 0) {
            console.log("Delta time:", deltaTime, "Speed:", this.speed, "Y pos:", this.y);
        }
    }
}