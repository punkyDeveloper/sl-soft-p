/* eslint-disable linebreak-style */
const CryptoJS = require('crypto-js');

const password = 'clave_super_secreta';
// Encriptar
exports.encriptar = (plaintext) => {
  const ciphertext = CryptoJS.AES.encrypt(plaintext, password).toString();
  return ciphertext;
};
// Desencriptar
exports.desencriptar = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, password);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};
