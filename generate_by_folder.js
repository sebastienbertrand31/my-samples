const fs = require("fs");
const path = require("path");

// dossier(s) à scanner
const rootDirs = ["SC"];
const baseURL = "https://raw.githubusercontent.com/sebastienbertrand31/my-samples/main/";

// objet final
const jsonOutput = { "_base": baseURL };

// fonction pour scanner un dossier récursivement
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith(".wav")) {
      results.push(filePath);
    }
  });
  return results;
}

// parcourir tous les dossiers racine
rootDirs.forEach(root => {
  const files = walk(root);

  // 1. Entrées par fichier
  files.forEach(f => {
    const key = path.basename(f, path.extname(f)); // ex: piano1
    const relativePath = f.replace(/\\/g, "/");    // chemin relatif
    jsonOutput[key] = relativePath;
  });

  // 2. Entrées par dossier
  const folders = {};
  files.forEach(f => {
    const relativePath = f.replace(/\\/g, "/");
    const folderName = relativePath.split("/")[1]; // SC/<folder>/file.wav → récupère <folder>
    if (!folders[folderName]) folders[folderName] = [];
    folders[folderName].push(relativePath);
  });

  Object.keys(folders).forEach(folder => {
    jsonOutput[folder] = folders[folder];
  });
});

// écrire le fichier JSON
fs.writeFileSync("strudel.json", JSON.stringify(jsonOutput, null, 2));
console.log("JSON généré avec _base, samples par fichier et par dossier !");
