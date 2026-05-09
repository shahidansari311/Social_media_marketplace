const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Marketplace.jsx', 'utf8');
code = code.replace(/  \}\) : \[\];\n  \}\) : \[\];/g, '  }) : [];');
fs.writeFileSync('client/src/pages/Marketplace.jsx', code);
