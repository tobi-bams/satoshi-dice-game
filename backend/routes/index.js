const express = require("express");
const { Address, Axios } = require("../util/index");
const axios = require("axios");
const { GetAddress } = require("../controller/index");

const routes = express.Router();

routes.get("/get_address", async (req, res) => {
  // const derivationPath = "m/84'/0'/0'"; //P2WPKH
  // const address = await Address(process.env.MNEMONIC, derivationPath);
  // const address = await GetAddress();
  const address = "tb1qpvf0hh2fmu8pp3mkwwvp38enfwtd534p096vzy";
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
  // try {
  //   const response = await axios.post(RPC_URL, body, {
  //     auth: {
  //       username: USER,
  //       password: PASS,
  //     },
  //   });
  //   console.log(response.data.result.vout);
  // } catch (error) {
  //   console.log(error.response.data);
  // }
  try {
    const response = await Axios("getrawtransaction", [
      "d304e574a6a371fe95a91d1b07facb79e1aed62f96d4ff16f5c06187c34e0a73",
      true,
    ]);
    console.log(response.data);
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
