const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const DIST = path.join(__dirname, 'dist');
const SRC = path.join(__dirname, 'src');
const TEMPLATES = path.join(SRC, 'templates');

// Read trip data
const trip = JSON.parse(fs.readFileSync(path.join(__dirname, 'trip.json'), 'utf8'));

// Read layout template
const layoutTpl = fs.readFileSync(path.join(TEMPLATES, 'layout.ejs'), 'utf8');

// Ensure dist/ exists
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Render a page using the layout
function renderPage(filename, pageTitle, bodyTemplate, data) {
  var bodyContent = ejs.render(
    fs.readFileSync(path.join(TEMPLATES, bodyTemplate), 'utf8'),
    data,
    { filename: path.join(TEMPLATES, bodyTemplate) }
  );

  var html = ejs.render(layoutTpl, {
    pageTitle: pageTitle,
    sections: trip.sections,
    body: bodyContent
  }, { filename: path.join(TEMPLATES, 'layout.ejs') });

  fs.writeFileSync(path.join(DIST, filename), html);
  console.log('  ✓ ' + filename);
}

console.log('Building Japan 2026...\n');

// 1. Section pages
trip.sections.forEach(function (section, i) {
  var prev = i > 0 ? trip.sections[i - 1] : null;
  var next = i < trip.sections.length - 1 ? trip.sections[i + 1] : null;

  renderPage(section.id + '.html', section.title, 'section.ejs', {
    section: section,
    prevSection: prev,
    nextSection: next
  });
});

// 2. Index page
renderPage('index.html', 'Home', 'index.ejs', {
  meta: trip.meta,
  sections: trip.sections
});

// 3. Packing page
renderPage('packing.html', 'Packing List', 'packing.ejs', {
  packing: trip.packing
});

// 4. Copy static assets
var assets = ['style.css', 'main.js', 'manifest.json', 'sw.js'];
assets.forEach(function (file) {
  fs.copyFileSync(path.join(SRC, file), path.join(DIST, file));
  console.log('  ✓ ' + file + ' (copied)');
});

console.log('\nDone! ' + (trip.sections.length + 2) + ' pages + ' + assets.length + ' assets → dist/');
