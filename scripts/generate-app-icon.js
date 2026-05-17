/** Electron용 512x512 PNG 생성 (순수 Node, 의존성 없음) */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const size = 512;
const row = 1 + size * 3;
const raw = Buffer.alloc(row * size);
const b = 37;
const g = 99;
const r = 37;

for (let y = 0; y < size; y += 1) {
  const off = y * row;
  raw[off] = 0;
  for (let x = 0; x < size; x += 1) {
    const i = off + 1 + x * 3;
    const corner =
      (x - 64) ** 2 + (y - 64) ** 2 < 48 ** 2 ||
      (x - 448) ** 2 + (y - 64) ** 2 < 48 ** 2;
    const board = y < 100 && x > 64 && x < 448;
    const desk =
      (y > 160 && y < 250 && x > 80 && x < 200) ||
      (y > 160 && y < 250 && x > 210 && x < 330) ||
      (y > 160 && y < 250 && x > 340 && x < 460) ||
      (y > 270 && y < 360 && x > 150 && x < 270) ||
      (y > 270 && y < 360 && x > 280 && x < 400);

    if (board) {
      raw[i] = 30;
      raw[i + 1] = 58;
      raw[i + 2] = 47;
    } else if (desk) {
      raw[i] = 255;
      raw[i + 1] = 255;
      raw[i + 2] = 255;
    } else if (corner) {
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    } else {
      raw[i] = 29;
      raw[i + 1] = 78;
      raw[i + 2] = 216;
    }
  }
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crcBuf = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, t, data, crc]);
}

const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(size, 0);
ihdr.writeUInt32BE(size, 4);
ihdr[8] = 8;
ihdr[9] = 2;
const idat = zlib.deflateSync(raw, { level: 9 });
const png = Buffer.concat([
  sig,
  chunk("IHDR", ihdr),
  chunk("IDAT", idat),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = path.join(__dirname, "..", "build", "icon.png");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, png);
console.log("build/icon.png 생성 완료");
