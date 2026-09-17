const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

(async () => {
  const webp = path.join("public", "Images", "Ryzom logo.webp");
  const trimmed = await sharp(webp).trim({ threshold: 10 }).png().toBuffer();
  const { width, height } = await sharp(trimmed).metadata();
  const letterW = width / 5;

  const left = Math.round(letterW * 1.02);
  const cropW = Math.min(Math.round(letterW * 0.9), width - left);
  const crop = await sharp(trimmed)
    .extract({ left, top: 0, width: cropW, height })
    .trim({ threshold: 12 })
    .png()
    .toBuffer();

  const size = 512;
  const pad = 0.22;
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(crop)
    .resize({ width: inner, height: inner, fit: "inside" })
    .toBuffer();
  const mm = await sharp(mark).metadata();

  const square = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      {
        input: mark,
        left: Math.floor((size - mm.width) / 2),
        top: Math.floor((size - mm.height) / 2),
      },
    ])
    .png()
    .toBuffer();

  const circleSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>
    </svg>`
  );

  const circular = await sharp(square)
    .composite([{ input: circleSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(circular).resize(32, 32).png().toFile("app/icon.png");
  await sharp(circular).resize(180, 180).png().toFile("app/apple-icon.png");

  const sizes = [16, 32, 48];
  const buffers = await Promise.all(
    sizes.map((s) => sharp(circular).resize(s, s).png().toBuffer())
  );

  function createIco(pngBuffers) {
    const count = pngBuffers.length;
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(count, 4);
    const dir = Buffer.alloc(count * 16);
    let o = 6 + count * 16;
    pngBuffers.forEach((buf, i) => {
      const s = sizes[i];
      dir.writeUInt8(s >= 256 ? 0 : s, i * 16 + 0);
      dir.writeUInt8(s >= 256 ? 0 : s, i * 16 + 1);
      dir.writeUInt8(0, i * 16 + 2);
      dir.writeUInt8(0, i * 16 + 3);
      dir.writeUInt16LE(1, i * 16 + 4);
      dir.writeUInt16LE(32, i * 16 + 6);
      dir.writeUInt32LE(buf.length, i * 16 + 8);
      dir.writeUInt32LE(o, i * 16 + 12);
      o += buf.length;
    });
    return Buffer.concat([header, dir, ...pngBuffers]);
  }

  fs.writeFileSync("app/favicon.ico", createIco(buffers));
  await sharp(circular).resize(128, 128).toFile("public/Images/_circle-preview.png");
  console.log("circular favicon written");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
