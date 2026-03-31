/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  cream: '#f0f7ff',        // ← was warm beige, now cool blue-white (page background)
  'cream-2': '#e1eefb',    // ← was darker beige, now slightly deeper blue-white (cards)
  ink: '#0f1f3d',          // ← was warm near-black, now deep navy (text + dark buttons)
  mist: '#4a6080',         // ← was warm gray, now slate-blue (secondary text)
  stone: '#b8d0e8',        // ← was warm gray border, now cool blue-gray border
  brand: {
    400: '#60a5fa',
    500: '#3b82f6',        // ← was indigo, now clear blue accent
    600: '#2563eb',
  },
  gold: {
    400: '#34d399',
    500: '#10b981',        // ← was amber/gold, now teal (CTAs pop against blue)
    600: '#059669',
  },
},
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}