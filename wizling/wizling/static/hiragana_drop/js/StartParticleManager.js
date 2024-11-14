// KanaParticleManager.js
import { CHARACTER_GROUPS } from './GameDataProvider.js';
import Theme from './Theme.js';

export class StartParticleManager {
    constructor() {
        this.particles = [];
        this.animationFrame = null;
    }

    start(script) {
        this.currentScript = script;
        this.animate();
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    animate = () => {
        if (CHARACTER_GROUPS &&
            CHARACTER_GROUPS[this.currentScript] &&
            Math.random() < 0.1) {
            this.addParticle();
        }
        this.animationFrame = requestAnimationFrame(this.animate);
    }

    addParticle() {
        if (!CHARACTER_GROUPS || !CHARACTER_GROUPS[this.currentScript]) {
            return;
        }
        const chars = Object.keys(CHARACTER_GROUPS[this.currentScript]);
        if (!chars.length) return;

        this.particles.push({
            char: chars[Math.floor(Math.random() * chars.length)],
            x: Math.random() * 800,
            y: -30,
            speed: 0.5 + Math.random() * 1,
            opacity: 0.1 + Math.random() * 0.2,
            scale: 0.5 + Math.random() * 1
        });
    }

    draw(ctx) {
        ctx.save();
        this.particles = this.particles.filter(p => {
            p.y += p.speed;
            p.opacity = Math.max(0, p.opacity - 0.001);

            if (p.y > 600 || p.opacity <= 0) return false;

            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = Theme.colors.primary.main;
            ctx.font = `${24 * p.scale}px "Noto Sans JP"`;
            ctx.fillText(p.char, p.x, p.y);

            return true;
        });
        ctx.restore();
    }
}