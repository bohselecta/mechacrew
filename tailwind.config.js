module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mecha-red': '#E6322B',
        'neon-blue': '#08B0D5',
        'steel-gray': '#2E2E2E',
        'gunmetal': '#3F4A4F',
        'accent-yellow': '#F9D648',
        'cream': '#F8F0E3',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.5s ease-out',
        'chrome-sweep': 'chromeSweep 1.5s ease-in-out',
        'pulse-neon': 'pulseNeon 1s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #08B0D5, 0 0 10px #08B0D5, 0 0 15px #08B0D5' },
          '100%': { boxShadow: '0 0 10px #08B0D5, 0 0 20px #08B0D5, 0 0 30px #08B0D5' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        chromeSweep: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      backgroundImage: {
        'blueprint-grid': 'linear-gradient(rgba(8, 176, 213, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(8, 176, 213, 0.1) 1px, transparent 1px)',
        'hud-scanline': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(8, 176, 213, 0.1) 2px, rgba(8, 176, 213, 0.1) 4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
