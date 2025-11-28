const fs = require("fs");

function runXF(code) {
  let cssColor = "black";
  let vars = {};

  // Doctype
  let html = `<!DOCTYPE html><html><head>`;

  // Title
  const title = code.match(/\{title\}([\s\S]*?)\{\/title\}/);
  if (title) {
    html += `<title>${title[1].trim()}</title>`;
  }
  html += `</head><body>`;

  // Warna
  const color = code.match(/color\s*>>\s*\("([^"]+)"\)/);
  if (color) cssColor = color[1];

  // Variabel
  const varMatches = [...code.matchAll(/var!(\w+)\s*=\s*"([^"]*)"/g)];
  for (let v of varMatches) {
    vars[v[1]] = v[2];
  }

  // tampil(variable)
  const tampilMatches = [...code.matchAll(/tampil\((\w+)\)/g)];
  for (let t of tampilMatches) {
    const val = vars[t[1]] ?? "";
    html += `<div style="color:${cssColor}">${val}</div>`;
  }

  // Heading (banyak say >>)
  const sayAll = [...code.matchAll(/say\s*>>\s*\("([^"]*)"\)/g)];
  for (let s of sayAll) {
    html += `<h1 style="color:${cssColor}">${s[1]}</h1>`;
  }

  // Paragraf (banyak p >>)
  const pAll = [...code.matchAll(/p\s*>>\s*\("([^"]*)"\)/g)];
  for (let p of pAll) {
    html += `<p style="color:${cssColor}">${p[1]}</p>`;
  }

  // Button + href (banyak)
  const btnAll = [
    ...code.matchAll(/button\s*>>\s*\("([^"]*)"\s*\[\s*href\s*=\s*([^\]]+)\]\s*\)/g)
  ];
  for (let b of btnAll) {
    const label = b[1];
    const href = b[2].trim();
    html += `
      <a href="${href}">
        <button style="padding:8px 12px;border:1px solid ${cssColor};border-radius:6px;color:${cssColor}">
          ${label}
        </button>
      </a>
    `;
  }

  // If-else
  const ifMatches = [...code.matchAll(/jika\s*(.*?)\{([\s\S]*?)\}\{selain\}\{([\s\S]*?)\}/g)];
  for (let i of ifMatches) {
    try {
      if (eval(i[1])) {
        const ifSay = i[2].match(/say\s*>>\s*\("([^"]*)"\)/);
        if (ifSay) html += `<h1 style="color:${cssColor}">${ifSay[1]}</h1>`;
      } else {
        const elseSay = i[3].match(/say\s*>>\s*\("([^"]*)"\)/);
        if (elseSay) html += `<h1 style="color:${cssColor}">${elseSay[1]}</h1>`;
      }
    } catch {
      html += `<div style="color:red">Runtime Error in if condition</div>`;
    }
  }

  // Loop ulang!N{}
  const loopMatches = [...code.matchAll(/ulang!(\d+)\{([\s\S]*?)\}/g)];
  for (let l of loopMatches) {
    const count = parseInt(l[1]);
    const content = l[2];

    const loopParts = [...content.split("\n").map(x => x.trim())];
    for (let n = 0; n < count; n++) {
      for (let line of loopParts) {
        const sp = line.match(/say\s*>>\s*\("([^"]*)"\)/);
        const pp = line.match(/p\s*>>\s*\("([^"]*)"\)/);
        const bt = line.match(/button\s*>>\s*\("([^"]*)"\s*\[\s*href\s*=\s*([^\]]+)\]/);

        if (sp) html += `<h1 style="color:${cssColor}">${sp[1]}</h1>`;
        if (pp) html += `<p style="color:${cssColor}">${pp[1]}</p>`;
        if (bt) {
          html += `<a href="${bt[2].trim()}"><button style="padding:6px 10px;border:1px solid ${cssColor};border-radius:6px;color:${cssColor}">${bt[1]}</button></a>`;
        }
      }
    }
  }

  html += `</body></html>`;
  return html;
}

// Terminal debug mode
if (require.main === module) {
  const file = fs.readFileSync("/main.xf", "utf-8");
  const resultHTML = runXF(file);

  console.log("\n===== HASIL RENDER HTML (.xf) =====\n");
  console.log(resultHTML);
  console.log("\n==================================\n");

  // Prompt gabungan untuk AI di terminal
  const promptLines = code => [
    ...code.matchAll(/(say|p)\s*>>\s*\("([^"]*)"\)/g)
  ].map(m => m[2]).join("\n");

  console.log("===== PROMPT AI DARI .xf =====\n");
  console.log(promptLines(file));
  console.log("\n=============================\n");
}

module.exports = { runXF };
