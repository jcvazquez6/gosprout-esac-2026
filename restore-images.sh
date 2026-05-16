#!/bin/bash

echo "🔄 Restoring GoSprout ESAC images and logos..."

# ─── IMAGES ───────────────────────────────────────────────────────────────────
sed -i '' 's|"https://[^"]*unsplash[^"]*w=800[^"]*hero[^"]*"|"/images/hero.jpg"|g' src/App.jsx

# Replace all Unsplash URLs with local image paths
node -e "
const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// Image replacements
const replacements = {
  'hero':         '/images/hero.jpg',
  'problem':      '/images/problem.png',
  'whoSupport':   '/images/who-support.png',
  'platform':     '/images/platform.png',
  'conference':   '/images/conference.jpg',
  'caseUA':       '/images/case-ua.png',
  'caseVolvo':    '/images/case-volvo.png',
  'casePearce':   '/images/case-pearce.png',
  'caseFCC':      '/images/case-fcc.png',
  'caseRadiance': '/images/case-radiance.png',
  'caseNSBU':     '/images/case-nsbu.png',
  'caseMET':      '/images/case-met.png',
  'caseAPHC':     '/images/case-aphc.png',
  'caseBY':       '/images/case-by.png',
};

// Replace Unsplash URLs in IMAGES object
code = code.replace(/const IMAGES = \{[\s\S]*?\};/, \`const IMAGES = {
  hero:         \"\${replacements.hero}\",
  problem:      \"\${replacements.problem}\",
  whoSupport:   \"\${replacements.whoSupport}\",
  platform:     \"\${replacements.platform}\",
  conference:   \"\${replacements.conference}\",
  caseUA:       \"\${replacements.caseUA}\",
  caseVolvo:    \"\${replacements.caseVolvo}\",
  casePearce:   \"\${replacements.casePearce}\",
  caseFCC:      \"\${replacements.caseFCC}\",
  caseRadiance: \"\${replacements.caseRadiance}\",
  caseNSBU:     \"\${replacements.caseNSBU}\",
  caseMET:      \"\${replacements.caseMET}\",
  caseAPHC:     \"\${replacements.caseAPHC}\",
  caseBY:       \"\${replacements.caseBY}\",
};\`);

// Replace GoSproutLogo function
code = code.replace(
  /function GoSproutLogo\(\{ size = 32 \}\) \{[\s\S]*?\n\}/,
  \`function GoSproutLogo({ size = 32 }) {
  return (
    <img src=\"/images/logo.png\" alt=\"GoSprout\" style={{ height: size, width: \"auto\" }} />
  );
}\`
);

// Replace GoSproutIcon function
code = code.replace(
  /function GoSproutIcon\(\{ size = 32 \}\) \{[\s\S]*?\n\}/,
  \`function GoSproutIcon({ size = 32 }) {
  return (
    <img src=\"/images/icon.png\" alt=\"GoSprout\" style={{ height: size, width: \"auto\" }} />
  );
}\`
);

fs.writeFileSync('src/App.jsx', code);
console.log('✅ Images, logo, and icon restored successfully.');
"

echo "📦 Committing and pushing..."
git add .
git commit -m "restore local images, logo, and icon"
git push

echo "🚀 Done! Netlify will redeploy in ~60 seconds."
