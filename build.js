const esbuild = require('esbuild');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');
const path = require('path');

// Ensure public directories exist (Vercel serves from public/)
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}
if (!fs.existsSync('./public/assets')) {
  fs.mkdirSync('./public/assets', { recursive: true });
}

// Process CSS with Tailwind
async function processCss() {
  const css = fs.readFileSync('./src/index.css', 'utf8');
  const result = await postcss([tailwindcss, autoprefixer]).process(css, {
    from: './src/index.css',
    to: './public/assets/main.css',
  });
  fs.writeFileSync('./public/assets/main.css', result.css);
  if (result.map) {
    fs.writeFileSync('./public/assets/main.css.map', result.map.toString());
  }
}

// Copy and update index.html
const html = fs.readFileSync('./index.html', 'utf8');
const updatedHtml = html
  .replace(/src="\/src\/main\.tsx"/, 'src="/assets/main.js"')
  .replace(/<script type="module"/, '<script')
  .replace(/<\/head>/, '  <link rel="stylesheet" href="/assets/main.css">\n  </head>');
fs.writeFileSync('./public/index.html', updatedHtml);

// Build frontend
async function build() {
  try {
    console.log('Processing CSS with Tailwind...');
    await processCss();
    console.log('✓ CSS processed');

    console.log('Building JavaScript...');
    await esbuild.build({
      entryPoints: ['./src/main.tsx'],
      bundle: true,
      minify: true,
      sourcemap: true,
      outfile: './public/assets/main.js',
      loader: {
        '.tsx': 'tsx',
        '.ts': 'ts',
        '.jsx': 'jsx',
        '.js': 'js',
        '.svg': 'dataurl',
        '.png': 'dataurl',
        '.jpg': 'dataurl',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
        'import.meta.env.VITE_API_URL': 'undefined',
      },
      external: [],
      platform: 'browser',
      target: ['es2020'],
      format: 'iife',
      logLevel: 'info',
    });

    console.log('✓ Frontend build completed successfully');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
