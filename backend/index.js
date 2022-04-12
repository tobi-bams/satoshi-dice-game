const express = require("express");
const dotenv = require("dotenv");
const { GET_PRIVATE_KEY } = require("./util/private_key");
const { X_Pub_Key } = require("./util/xpub");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
// console.log(process.env.MNEMONIC_KEY);
const getCredentials = async () => {
  const privateKey = await GET_PRIVATE_KEY(process.env.MNEMONIC_KEY);
  const derivationPath = "m/84'/0'/0'"; //P2WPKH
  const xpub = X_Pub_Key(privateKey, derivationPath);
  console.log(xpub);
};
getCredentials();
app.listen(PORT, () => {
  console.log("The App is running");
});
