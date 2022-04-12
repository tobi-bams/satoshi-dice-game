const express = require("express");
const dotenv = require("dotenv");
const { GET_PRIVATE_KEY } = require("./util/private_key");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
// console.log(process.env.MNEMONIC_KEY);
const getCredentials = async () => {
  console.log(await GET_PRIVATE_KEY(process.env.MNEMONIC_KEY));
};
getCredentials();
app.listen(PORT, () => {
  console.log("The App is running");
});
