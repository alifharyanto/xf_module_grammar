const fs = require("fs");
const { parseXF } = require("./xf.js");

// Simulasi fungsi AI yang menjalankan prompt
async function runAI() {
  // Baca kode .xf
  const xfCode = fs.readFileSync("/main.xf", "utf-8");

  // Konversi sintaks .xf → prompt string
  const prompt = parseXF(xfCode);

  console.log("=== PROMPT DARI .xf ===");
  console.log(prompt);
  console.log("=======================");

  // API call AI nanti ditaruh di sini
  // Contoh hanya simulasi response:
  console.log("AI Response: " + prompt.toUpperCase());
}

runAI();
