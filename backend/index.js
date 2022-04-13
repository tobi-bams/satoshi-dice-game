const express = require("express");
const dotenv = require("dotenv");
const { Address } = require("./util/index");
const route = require("./routes/index");

dotenv.config();

const app = express();

app.use("/", route);
const PORT = process.env.PORT || 8000;
const getCredentials = async () => {
  const derivationPath = "m/84'/0'/0'"; //P2WPKH
  const address = await Address(process.env.MNEMONIC_KEY, derivationPath);
  console.log(address);
};

getCredentials();
app.listen(PORT, () => {
  console.log("The App is running");
});
