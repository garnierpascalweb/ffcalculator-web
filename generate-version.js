// generate-version.js
const fs = require('fs');
const path = require('path');
const { version } = require('./package.json');

// Assure que le dossier "src/assets" existe
const outputDir = path.join(__dirname, 'src', 'assets');
const outputFile = path.join(outputDir, 'version.json');

// Crée le dossier s'il n'existe pas
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Contenu du fichier JSON
const versionData = {
  version: version,
  buildDate: new Date().toISOString()
};

// Écriture du fichier
fs.writeFileSync(outputFile, JSON.stringify(versionData, null, 2));
console.log(`✅ version.json généré à : ${outputFile}`);
