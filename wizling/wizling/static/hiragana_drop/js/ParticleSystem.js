import Theme from './Theme.js';

export default class ParticleSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.particles = [];
        this.lastUpdate = performance.now();
    }

    createEffect(x, y) {
        const colors = [Theme.colors.secondary.medium, Theme.colors.secondary.main, Theme.colors.secondary.light, Theme.colors.secondary.pale]; // Vibrant warm palette (orange, red, yellow)
        console.log('ParticleSystem.js: createEffect: colors:', colors);
        // Define ranges for particle properties
        const minSize = 4; // Minimum particle size
        const maxSize = 7; // Maximum particle size
        const minVelocity = 0.5; // Minimum speed of particles
        const maxVelocity = 1.3; // Maximum speed of particles

        for (let i = 0; i < 20; i++) { // Moderate particle count for density
            const angle = Math.random() * Math.PI * 2; // Spread particles in all directions
            const velocity = minVelocity + Math.random() * (maxVelocity - minVelocity); // Random velocity within range
            const size = minSize + Math.random() * (maxSize - minSize); // Random size within range

            this.particles.push({
                x, // Initial x-position of the particle
                y, // Initial y-position of the particle
                vx: Math.cos(angle) * velocity, // Horizontal velocity based on angle
                vy: Math.sin(angle) * velocity, // Vertical velocity based on angle
                size, // Size of the particle
                color: colors[Math.floor(Math.random() * colors.length)], // Randomly pick a color from the palette
                life: 1.2, // Initial lifespan of the particle (affects fade-out)
                opacity: 1 // Initial opacity (fully visible)
            });
        }
    }




    update() {
        if (this.particles.length === 0) return;

        const now = performance.now();
        const deltaTime = (now - this.lastUpdate) / 16.67; // Normalize deltaTime to ~60 FPS
        this.lastUpdate = now;

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter'; // Vibrant blending

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update particle position and motion
            p.x += p.vx * deltaTime * 0.6;
            p.y += p.vy * deltaTime * 0.6;
            p.vy += 0.01 * deltaTime; // Gravity pull
            p.vx *= 0.97; // Gradual horizontal damping
            p.vy *= 0.97; // Gradual vertical damping
            p.life -= 0.01; // Lifespan decay
            p.opacity = Math.max(0, p.life); // Fade out based on life

            if (p.life <= 0) {
                this.particles.splice(i, 1); // Remove fully faded particles
                continue;
            }

            this.ctx.globalAlpha = p.opacity;

            // Create a radial gradient
            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            gradient.addColorStop(0, Theme.hexToRgba(p.color, 1)); // Center: Full opacity of particle's color
            gradient.addColorStop(0.3, Theme.hexToRgba(p.color, 0.4)); // Mid-point: Softer opacity
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Edge: Transparent fade-out

            // Draw the gradient
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); // Draw particle
            this.ctx.fill();

            // Add glow effect using the particle's base color
            this.ctx.shadowColor = Theme.hexToRgba(p.color, 0.3); // Slightly transparent glow
            this.ctx.shadowBlur = p.size * 1.2; // Glow intensity proportional to size
        }

        this.ctx.restore();
    }





    reset() {
        this.particles = [];
    }
}
