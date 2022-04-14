const express = require("express");
const { Address } = require("../util/index");
const axios = require("axios");

const routes = express.Router();

const RPC_URL = `http://${process.env.RPC_USER}:${process.env.RPC_PASSWORD}@127.0.0.1:8332/`;

routes.get("/get_address", async (req, res) => {
  const derivationPath = "m/84'/0'/0'"; //P2WPKH
  const address = await Address(process.env.MNEMONIC, derivationPath);
  res.status(200).json({
    status: true,
    message: "Public Address for the Company",
    data: { address: address },
  });
});

routes.post("/transaction_id", async (req, res) => {
  const USER = process.env.RPC_USER;
  const PASS = process.env.RPC_PASSWORD;

  const RPC_URL = `http://127.0.0.1:38332/`;
  const body = `{"jsonrpc": "1.0","id": "curltext","method": "getrawtransaction","params": ["d304e574a6a371fe95a91d1b07facb79e1aed62f96d4ff16f5c06187c34e0a73", true]}`;
  const data = `{"jsonrpc":"1.0","method":"getblockcount","params":[]}`;
  try {
    const response = await axios.post(RPC_URL, body, {
      auth: {
        username: USER,
        password: PASS,
      },
    });
    console.log(response.data.result.vout);
  } catch (error) {
    console.log(error.response.data);
  }
  res.status(200).json({
    status: true,
    message: "Game Status",
    data: { transaction: req.body.transaction_id },
  });
});

module.exports = routes;
