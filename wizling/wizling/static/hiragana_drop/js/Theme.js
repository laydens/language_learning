// Theme.js
const Theme = {
    colors: {
        // Main palette
        background: {
            primary: '#F3F7F9',
            gradient: {
                start: '#F3F7F9',
                end: '#E8F4FF'
            }
        },
        primary: '#4361EE',
        secondary: '#E8F4FF',
        accent: '#FF6B6B',
        text: {
            primary: '#2C3E50',
            secondary: '#64748B',
            light: '#94A3B8'
        },
        success: {
            primary: '#FF6D00',     // Vivid orange
            secondary: '#FF9100',    // Bright orange
            glow: '#FF5722'         // Deep orange-red for intense glow
        },
        mistake: {
            primary: '#FF1744',     // Bright red
            secondary: '#FF4081',    // Pink-red
            glow: '#D50000'         // Deep red for glow
        },
        overlay: 'rgba(44, 62, 80, 0.85)'
    },

    // Animation timings
    animation: {
        quick: '150ms',
        default: '300ms',
        slow: '500ms'
    },

    // Game specific styles
    game: {
        character: {
            size: 48,
            targetGlow: 15,
            colors: {
                active: '#FF6B6B',
                inactive: '#2C3E50'
            }
        },

        options: {
            height: 56,
            radius: 12,
            glow: {
                hover: 8,
                active: 12
            }
        },

        particles: {
            count: 25,
            size: {
                min: 2,
                max: 8
            },
            velocity: {
                initial: 10,
                gravity: 0.1
            },
            lifetime: {
                fadeSpeed: 0.01
            },
            glow: {
                blur: 10
            }
        }
    }
};
export default Theme;