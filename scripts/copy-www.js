const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const www = path.join(root, "www");

const files = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
];

const dirs = ["css", "js", "assets"];

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else copyFile(src, dest);
  }
}

if (fs.existsSync(www)) fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

files.forEach((f) => copyFile(path.join(root, f), path.join(www, f)));
dirs.forEach((d) => copyDir(path.join(root, d), path.join(www, d)));

console.log("www/ 폴더 준비 완료");
