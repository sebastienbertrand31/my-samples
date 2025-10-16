const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Dossier racine à scanner
const rootFolder = __dirname;

// Fonction récursive pour récupérer tous les fichiers .wav
function getAllWavFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getAllWavFiles(filePath)); // récursion
    } else if (file.toLowerCase().endsWith('.wav')) {
      results.push(filePath);
    }
  });

  return results;
}

// Génération du JSON
const wavFiles = getAllWavFiles(rootFolder);
const jsonOutput = JSON.stringify(wavFiles, null, 2);
const outputPath = path.join(rootFolder, 'strudel.json');
fs.writeFileSync(outputPath, jsonOutput);
console.log(`JSON généré avec succès ! ${wavFiles.length} fichiers trouvés.`);
console.log(`Chemin du JSON : ${outputPath}`);

// Interface pour chercher un sample
cons
