/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme
        light: {
          bg: '#fafafa',
          surface: '#ffffff',
          text: '#1a1a1a',
          muted: '#6b7280',
          accent: '#3b82f6',
          border: '#e5e7eb',
        },
        // Dark theme
        dark: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          text: '#f5f5f5',
          muted: '#9ca3af',
          accent: '#60a5fa',
          border: '#2d2d2d',
        },
        // Neon theme
        neon: {
          bg: '#0a0a0f',
          surface: '#12121a',
          text: '#e0e0ff',
          muted: '#8888aa',
          accent: '#00ffaa',
          secondary: '#ff00aa',
          border: '#1f1f2e',
        },
        // Ocean theme
        ocean: {
          bg: '#0c1929',
          surface: '#132f4c',
          text: '#e3f2fd',
          muted: '#90caf9',
          accent: '#29b6f6',
          border: '#1e4976',
        },
        // Sunset theme
        sunset: {
          bg: '#1a1215',
          surface: '#2d1f24',
          text: '#fef3e2',
          muted: '#d4a574',
          accent: '#ff6b35',
          secondary: '#f7931e',
          border: '#3d2a30',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif',
        ],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-soft': 'pulse 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
