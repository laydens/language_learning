// ParticleSystem.js
import Theme from './Theme.js';

export default class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
        this.lastUpdate = performance.now();
    }

    createEffect(x, y, type) {
        const colors = type === 'success' ?
            [Theme.colors.success.primary, Theme.colors.success.secondary, Theme.colors.success.glow] :
            [Theme.colors.failure.primary, Theme.colors.failure.secondary, Theme.colors.failure.glow];

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
                opacity: 1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                baseSize: Math.random() * 4 + 2  // Base size for pulsing
            });
        }
    }

    update() {
        const now = performance.now();
        const deltaTime = (now - this.lastUpdate) / 16.67;
        this.lastUpdate = now;

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position with deltaTime
            p.x += p.vx * deltaTime;
            p.y += p.vy * deltaTime;

            // Apply gravity and resistance
            p.vy += Theme.game.particles.velocity.gravity * deltaTime;
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Update rotation
            p.rotation += p.rotationSpeed * deltaTime;

            // Fade out
            p.life -= Theme.game.particles.lifetime.fadeSpeed * deltaTime;
            p.opacity = p.life;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Draw with enhanced visibility
            this.ctx.save();

            // Use multiply blend mode for better contrast
            this.ctx.globalCompositeOperation = 'screen';

            // Increased shadow blur for more prominent glow
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 15 * p.opacity;

            // Draw particle with multiple layers for intensity
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);

            // Draw main particle
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.baseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // Draw outer glow
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.baseSize * 1.5, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(
                0, 0, p.baseSize * 0.5,
                0, 0, p.baseSize * 1.5
            );
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, `${p.color}00`);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    reset() {
        this.particles = [];
    }
}