const fs = require("fs");
const path = require("path");

// Dossier(s) racine à scanner
const rootDirs = ["SC"];

// URL de base pour GitHub
const baseURL = "https://raw.githubusercontent.com/sebastienbertrand31/my-samples/main/";

// Objet JSON avec _base en premier
const jsonOutput = { "_base": baseURL };

// Fonction récursive pour scanner un dossier
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

// Parcours des dossiers
rootDirs.forEach(root => {
  const files = walk(root);

  files.forEach(f => {
    // Nom du fichier sans extension → clé du JSON
    const key = path.basename(f, path.extname(f));

    // Chemin relatif depuis la racine du projet (donc SC/...)
    const relativePath = path.relative(process.cwd(), f).replace(/\\/g, "/");

    // Ajout au JSON
    jsonOutput[key] = relativePath;
  });
});

// Écriture du fichier JSON
fs.writeFileSync("strudel.json", JSON.stringify(jsonOutput, null, 2));
console.log("✅ JSON généré avec _base et chemins relatifs !");
