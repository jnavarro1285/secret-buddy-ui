module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html,css}',   // <-- importante: incluye .css y .module.css si aplicable
    // si tu proyecto está en subcarpeta, ajusta: './webapp/index.html', './webapp/src/**/*.{js,jsx,css}'
  ],
  theme: { extend: {} },
  plugins: [],
  // opcional: si generas clases dinámicamente, añade safelist
  // safelist: ['bg-gray-50']
}