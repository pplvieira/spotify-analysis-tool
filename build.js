const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Ensure public directories exist
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}
if (!fs.existsSync('./public/assets')) {
  fs.mkdirSync('./public/assets', { recursive: true });
}

// Copy CSS file directly (no processing needed)
const css = fs.readFileSync('./src/index.css', 'utf8');
fs.writeFileSync('./public/assets/main.css', css);
console.log('✓ CSS copied');

// Copy and update index.html
const html = fs.readFileSync('./index.html', 'utf8');
const updatedHtml = html
  .replace(/src="\/src\/main\.tsx"/, 'src="/assets/main.js"')
  .replace(/<script type="module"/, '<script')
  .replace(/<\/head>/, '  <link rel="stylesheet" href="/assets/main.css">\n  </head>');
fs.writeFileSync('./public/index.html', updatedHtml);
console.log('✓ HTML updated');

// Build JavaScript
esbuild.build({
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
  platform: 'browser',
  target: ['es2020'],
  format: 'iife',
  logLevel: 'info',
}).then(() => {
  console.log('✓ Frontend build completed');
}).catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});

