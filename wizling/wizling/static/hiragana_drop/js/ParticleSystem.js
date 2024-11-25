

import { PARTICLE_CONFIGS } from './ParticleConfig.js';

export default class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
    }

    createEffect(x, y, type = 'success') {
        const config = PARTICLE_CONFIGS[type];
        this._generateParticles(x, y, config);
    }

    _generateParticles(x, y, config) {
        for (let i = 0; i < config.count; i++) {
            const angle = (i / config.count) * Math.PI * 2;
            // Added spread factor
            const spread = this._random(config.physics.spread.min, config.physics.spread.max);
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * config.physics.velocity * spread,
                vy: Math.sin(angle) * config.physics.velocity * spread,
                size: this._random(config.size.min, config.size.max),
                color: config.colors[Math.floor(Math.random() * config.colors.length)],
                life: config.lifetime
            });
        }
    }

    _random(min, max) {
        return min + Math.random() * (max - min);
    }

    update() {
        if (!this.particles.length) return;
        const config = PARTICLE_CONFIGS['success'];
        this.ctx.save();

        // Core particles
        this.ctx.globalCompositeOperation = 'source-over';
        this.particles.forEach(p => {
            p.vx *= config.physics.drag;
            p.vy *= config.physics.drag;
            p.vy += config.physics.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= config.decay;



            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        });

        // Glow
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = 0.4;
        this.particles.forEach(p => {

            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, p.size * 0.5,
                p.x, p.y, p.size * 3
            );
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'rgba(255,224,178,0)');

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });

        this.ctx.restore();
        this.particles = this.particles.filter(p => p.life > 0);
    }

    reset() {
        this.particles = [];
    }
}