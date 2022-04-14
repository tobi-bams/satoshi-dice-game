const ecc = require("tiny-secp256k1");
const bitcoin = require("bitcoinjs-lib");
const bip39 = require("bip39");
const { networks, payments } = require("bitcoinjs-lib");
const axios = require("axios");

let BIP32Factory = require("bip32").default;
const bip32 = BIP32Factory(ecc);

const GET_PRIVATE_KEY = async (mnemonic) => {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const privateKey = bip32.fromSeed(seed, networks.testnet);
  return privateKey;
};

const X_Pub_Key = (privateKey, pathDerivation) => {
  const child = privateKey.derivePath(pathDerivation).neutered();
  const xpub = child.toBase58();
  return xpub;
};

const Public_Key = (xpub, pathDerivation) => {
  const node = bip32.fromBase58(xpub, networks.testnet);
  const child = node.derivePath(pathDerivation);
  return child;
};

const Address = async (mnemonic, pathDerivation) => {
  const private_key = await GET_PRIVATE_KEY(mnemonic);
  const xpub = X_Pub_Key(private_key, pathDerivation);
  const changePath = "0/0";
  const public_key = Public_Key(xpub, changePath);
  const address = payments.p2wpkh({
    pubkey: public_key.publicKey,
    network: networks.testnet,
  });
  return address.address;
};

const Axios = async (method, parameter = []) => {
  const USER = process.env.RPC_USER;
  const PASS = process.env.RPC_PASSWORD;

  const RPC_URL = `http://127.0.0.1:38332/`;
  const body = {
    jsonrpc: "1.0",
    id: "curltext",
    method: method,
    params: parameter,
  };

  try {
    const response = await axios.post(RPC_URL, JSON.stringify(body), {
      auth: {
        username: USER,
        password: PASS,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  Address,
  Axios,
};
