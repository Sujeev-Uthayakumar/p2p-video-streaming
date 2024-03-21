const crypto = require("crypto");
const fs = require("fs");

// AES-256-CBC encryption parameters
const algorithm = "aes-256-cbc";
// Securely generate and store these for actual use
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

/**
 * Encrypts a file using AES-256-CBC.
 */
const encryptFile = (sourcePath, destPath) => {
  return new Promise((resolve, reject) => {
    const rStream = fs.createReadStream(sourcePath);
    const wStream = fs.createWriteStream(destPath);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    rStream
      .pipe(cipher)
      .pipe(wStream)
      .on("finish", resolve)
      .on("error", reject);
  });
};

/**
 * Decrypts a file using AES-256-CBC.
 */
const decryptFile = (sourcePath, destPath) => {
  return new Promise((resolve, reject) => {
    const rStream = fs.createReadStream(sourcePath);
    const wStream = fs.createWriteStream(destPath);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    rStream
      .pipe(decipher)
      .pipe(wStream)
      .on("finish", resolve)
      .on("error", reject);
  });
};

module.exports = { encryptFile, decryptFile };
