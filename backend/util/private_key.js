const ecc = require("tiny-secp256k1");
const bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const { networks } = require("bitcoinjs-lib");

let BIP32Factory = require("bip32").default;

const GET_PRIVATE_KEY = async (mnemonic) => {
  const bip32 = BIP32Factory(ecc);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const privateKey = bip32.fromSeed(seed, networks.testnet);
  return privateKey;
};

module.exports = {
  GET_PRIVATE_KEY,
};
