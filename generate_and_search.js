const fs = require("fs");
const path = require("path");

// dossier à scanner
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
  files.forEach(f => {
    // créer une clé sample = nom du fichier sans extension
    const key = path.basename(f, path.extname(f));
    // créer chemin relatif depuis la racine du repo
    const relativePath = f.replace(/\\/g, "/"); // pour Windows si besoin
    jsonOutput[key] = relativePath;
  });
});

// écrire le fichier JSON
fs.writeFileSync("strudel.json", JSON.stringify(jsonOutput, null, 2));
console.log("JSON généré avec _base et tous les samples !");
