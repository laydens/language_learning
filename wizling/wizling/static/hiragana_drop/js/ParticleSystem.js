// ParticleSystem.js
import Theme from './Theme.js';

export default class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
        this.lastUpdate = performance.now();
    }

    createEffect(x, y, type) {
        console.log('Creating effect:', type);

        const colors = type === 'success' ?
            [Theme.colors.success.primary, Theme.colors.success.secondary, Theme.colors.success.glow] :
            [Theme.colors.mistake.primary, Theme.colors.mistake.secondary, Theme.colors.mistake.glow];

        console.log('Using colors:', colors);

        for (let i = 0; i < Theme.game.particles.count; i++) {
            const angle = (i / Theme.game.particles.count) * Math.PI * 2 + Math.random() * 0.5;
            const velocity = Theme.game.particles.velocity.initial * (0.8 + Math.random() * 0.4);

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Theme.game.particles.size.min +
                    Math.random() * (Theme.game.particles.size.max - Theme.game.particles.size.min),
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                opacity: .7,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                baseSize: Math.random() * 4 + 2
            });
        }
    }

    update() {
        const now = performance.now();
        const deltaTime = (now - this.lastUpdate) / 16.67;
        this.lastUpdate = now;

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;

            p.vy += Theme.game.particles.velocity.gravity * deltaTime;
            p.vx *= 0.99;
            p.vy *= 0.99;

            p.rotation += p.rotationSpeed * deltaTime;
            p.life -= Theme.game.particles.lifetime.fadeSpeed * deltaTime;
            p.opacity = p.life;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();

            // Changed blend mode to 'source-over' for more opacity
            this.ctx.globalCompositeOperation = 'source-over';

            // Set global alpha for overall opacity
            this.ctx.globalAlpha = p.opacity;

            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);

            // Draw base particle
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.baseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;  // Use direct color
            this.ctx.fill();

            // Add glow using shadow
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 15;
            this.ctx.fill();

            // Add extra bright center
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.baseSize * 0.2, 0, Math.PI * 2);
            this.ctx.fillStyle = '#fff';  // White center for extra pop
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    reset() {
        this.particles = [];
    }
}