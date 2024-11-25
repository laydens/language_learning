import Theme from "./Theme.js";


export const PARTICLE_CONFIGS = {
    success: {
        count: 15,
        colors: [
            Theme.colors.success.accent,  // Gold (accent)
            Theme.colors.success.vibrant,  // Dark Orange (vibrant)
            Theme.colors.success.primary,  // Soft Maple (primary)
            Theme.colors.success.secondary,  // Maple Mist (secondary)
        ],
        size: { min: 4, max: 6 },
        physics: {
            velocity: 2,
            spread: { min: 0.8, max: 1.5 },  // Added spread
            drag: 0.98,
            gravity: 0.08
        },
        glow: {
            enabled: true,
            blur: 10,
            alpha: 0.6,
            size: 2.5,
            color: Theme.hexToRgba(Theme.colors.success.glow, 0.6)
        },
        lifetime: 1,
        decay: 0.02
    },
    blast: {
        count: 20,
        colors: ['#F26419', '#C55A21'],
        size: { min: 3, max: 8 },
        physics: {
            velocity: 2.3,
            drag: 0.95,
            gravity: 0.135
        },
        lifetime: 1.5,
        decay: 0.015
    },
};
