const axios = require("axios");
const { ResHandler } = require("../util/index");
const GetAddress = async () => {
  const USER = process.env.RPC_USER;
  const PASS = process.env.RPC_PASSWORD;

  const RPC_URL = `http://127.0.0.1:38332/`;
  const body = `{"jsonrpc": "1.0","id": "curltext","method": "getnewaddress","params": ["P2WPKH"]}`;

  try {
    const response = await axios.post(RPC_URL, body, {
      auth: {
        username: USER,
        password: PASS,
      },
    });
    console.log(response.data.result);
  } catch (error) {
    console.log(error.response);
  }
};

const GetRawTransaction = (transaction_id) => {};

const GameProcessor = (transaction_id) => {
  return ResHandler(200, "Transaction Successfull", { transaction_id });
};

module.exports = {
  GetAddress,
  GameProcessor,
};
