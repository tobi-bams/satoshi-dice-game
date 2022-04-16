const express = require("express");
const { Address, Axios, ResHandler } = require("../util/index");
const axios = require("axios");
const {
  GetAddress,
  GameProcessor,
  GetRawTransaction,
} = require("../controller/index");

const routes = express.Router();

routes.get("/get_address", async (req, res) => {
  const address = "tb1qpvf0hh2fmu8pp3mkwwvp38enfwtd534p096vzy";
  res.status(200).json({
    status: true,
    message: "Public Address for the Company",
    data: { address },
  });
});

routes.post("/transaction_id", async (req, res) => {
  const result = await GameProcessor(req.body.transaction_id);
  res.status(result.status).json(result.body);
});

routes.post("/raw_transaction", async (req, res) => {
  const result = await GetRawTransaction(req.body.tx_id);
  res.status(200).json({ result });
});

module.exports = routes;
