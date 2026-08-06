const fs = require('fs');

let content = fs.readFileSync('src/data.js', 'utf8');

let theoriesMatch = content.match(/export const THEORIES = (\[[\s\S]*\]);?/);
if (!theoriesMatch) {
  console.log('Failed to match THEORIES array');
  process.exit(1);
}

let theoriesStr = theoriesMatch[1];
let theoriesArray = eval(`(${theoriesStr})`);

theoriesArray.forEach(theory => {
  let text = (theory.title + " " + theory.description).toLowerCase();
  let tags = new Set();
  
  if (text.match(/assassin|kill|murder|death|shoot|shot|dead|die/)) { tags.add('True Crime'); tags.add('Assassination'); }
  if (text.match(/ufo|alien|space|moon|mars|planet|roswell|saucer|extraterrestrial/)) { tags.add('Extraterrestrial'); tags.add('Cosmic'); }
  if (text.match(/monster|creature|beast|mothman|chupacabra|bigfoot|yeti|nessie|cryptid|ape/)) { tags.add('Cryptid'); tags.add('Folklore'); }
  if (text.match(/secret|society|illuminati|mason|cult|order|templar|skull/)) { tags.add('Secret Society'); tags.add('Occult'); }
  if (text.match(/government|cia|fbi|nsa|project|experiment|mkultra|cover-up|military|classified|area 51/)) { tags.add('Cover-up'); tags.add('Classified'); }
  if (text.match(/ghost|spirit|haunt|demon|possession|paranormal|poltergeist/)) { tags.add('Paranormal'); tags.add('Supernatural'); }
  if (text.match(/ancient|pyramid|ruin|maya|egypt|aztec|atlantis|stonehenge|civilization/)) { tags.add('Ancient History'); tags.add('Archaeology'); }
  if (text.match(/virus|disease|vaccine|health|biowarfare|lab|pandemic|cure/)) { tags.add('Biology'); tags.add('Science'); }
  if (text.match(/mind|control|brain|telepath|psych|consciousness|hypnosis/)) { tags.add('Psychology'); tags.add('Consciousness'); }
  if (text.match(/tech|computer|internet|simulation|matrix|hacker|ai|artificial/)) { tags.add('Technology'); tags.add('Digital'); }
  if (text.match(/time|travel|dimension|portal|quantum|philadelphia/)) { tags.add('Quantum'); tags.add('Physics'); }
  if (text.match(/earth|hollow|flat|geo|mountain|ocean|bermuda|triangle|sea/)) { tags.add('Geology'); tags.add('Phenomena'); }
  
  let tagArray = Array.from(tags);
  
  if (tagArray.length < 2) {
    if (theory.category === 'historical') { tagArray.push('History'); tagArray.push('Mystery'); }
    else if (theory.category === 'tech') { tagArray.push('Science'); tagArray.push('Technology'); }
    else if (theory.category === 'crypto') { tagArray.push('Biology'); tagArray.push('Phenomena'); }
    else if (theory.category === 'space') { tagArray.push('Astrophysics'); tagArray.push('Cosmic'); }
    else if (theory.category === 'mind') { tagArray.push('Philosophy'); tagArray.push('Psychology'); }
    else if (theory.category === 'secret') { tagArray.push('Espionage'); tagArray.push('Government'); }
    else if (theory.category === 'geo') { tagArray.push('Nature'); tagArray.push('Geology'); }
  }
  
  theory.tags = Array.from(new Set(tagArray)).slice(0, 2);
});

let newTheoriesStr = JSON.stringify(theoriesArray, null, 2);
content = content.replace(/export const THEORIES = \[[\s\S]*\];?/, `export const THEORIES = ${newTheoriesStr};`);

fs.writeFileSync('src/data.js', content);
console.log('Smart tags applied successfully!');
