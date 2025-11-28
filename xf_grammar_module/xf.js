const fs = require("fs");

// Fungsi compile .xf → JS string
function parseXF(code) {
  const say = code.match(/say\s*>>\s*\("([^"]*)"\)/g) || [];
  let output = "";

  for (let line of say) {
    const text = line.match(/"([^"]*)"/)[1];
    output += text + "\n";
  }
  return output.trim();
}

module.exports = { parseXF };
