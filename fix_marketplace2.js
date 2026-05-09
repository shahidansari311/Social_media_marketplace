const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Marketplace.jsx', 'utf8');
code = code.replace(/  \}\) : \[\];\n  const listings = useSelector\(state => state\.listing\?\.listings\) \?\? \[\];/g, '  });\n  const listings = useSelector(state => state.listing?.listings) ?? [];');
fs.writeFileSync('client/src/pages/Marketplace.jsx', code);
