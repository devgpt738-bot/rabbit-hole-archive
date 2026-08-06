const fs = require('fs');
let t = fs.readFileSync('src/data.js', 'utf8');
t = t.replace(/,\s*"Real Data"/g, '');
t = t.replace(/"Real Data",\s*/g, '');
t = t.replace(/"Real Data"/g, '');
fs.writeFileSync('src/data.js', t);
console.log('Tags removed!');
