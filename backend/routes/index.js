const express = require("express");
const { Address } = require("../util/index");

const routes = express.Router();

routes.get("/get_address", async (req, res) => {
  const derivationPath = "m/84'/0'/0'"; //P2WPKH
  const address = await Address(process.env.MNEMONIC, derivationPath);
  res.status(200).json({
    status: true,
    message: "Public Address for the Company",
    data: { address: address },
  });
});

module.exports = routes;
