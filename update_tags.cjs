const fs = require('fs');
const lines = fs.readFileSync('src/data.js', 'utf8').split('\n');

const categoryTags = {
  historical: ["History", "Cover-up", "True Crime", "Conspiracy"],
  tech: ["Science", "Cyberpunk", "Dystopia", "Technology"],
  crypto: ["Horror", "Biology", "Paranormal", "Folklore"],
  space: ["Cosmic", "Phenomena", "Extraterrestrial", "Astrophysics"],
  mind: ["Psychology", "Consciousness", "Esoteric", "Philosophy"],
  secret: ["Government", "Cult", "Espionage", "Occult"],
  geo: ["Nature", "Ancient", "Phenomena", "Geology"]
};

let currentCategory = null;
let newLines = [];
let insideTags = false;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  let catMatch = line.match(/"category":\s*"([^"]+)"/);
  if (catMatch) {
    currentCategory = catMatch[1];
  }
  
  if (line.includes('"tags": [')) {
    insideTags = true;
    newLines.push(line);
    
    let pool = categoryTags[currentCategory] || ["Mystery", "Anomaly"];
    // Deterministic pseudo-random based on string length to avoid reshuffling every time but look varied
    let seed = currentCategory ? currentCategory.length + i : i;
    let tag1 = pool[seed % pool.length];
    let tag2 = pool[(seed + 1) % pool.length];
    
    newLines.push(`      "${tag1}",`);
    newLines.push(`      "${tag2}"`);
    continue;
  }
  
  if (insideTags) {
    if (line.includes('],')) {
      insideTags = false;
      newLines.push(line);
    }
    continue;
  }
  
  newLines.push(line);
}

fs.writeFileSync('src/data.js', newLines.join('\n'));
console.log('Thematic tags updated successfully!');
