// js/Character.js
export default class FallingCharacter {
    constructor(character, x, speed, ctx) {
        this.character = character;
        this.x = x;
        this.y = 0; // Start at the top of the canvas
        this.speed = speed;
        this.ctx = ctx;
    }

    draw(isActive = false) {
        this.ctx.font = `${0.06 * this.ctx.canvas.width}px Arial`;
        this.ctx.fillStyle = isActive ? '#ff0000' : '#000';
        this.ctx.fillText(this.character, this.x, this.y);
    }

    update() {
        this.y += this.speed;
    }
}