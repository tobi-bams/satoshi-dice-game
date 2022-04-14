const axios = require("axios");
const { ResHandler, Axios } = require("../util/index");
const { createHash } = require("crypto");

const address = "tb1qpvf0hh2fmu8pp3mkwwvp38enfwtd534p096vzy";

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

const ValidateTxId = (tx_id) => {
  if (tx_id.length === 64) {
    return true;
  } else {
    return false;
  }
};

const Sha512 = (string) => {
  let hash = createHash("sha512").update(string).digest("hex");
  const length = hash.length;
  hash = `${hash[length - 4]}${hash[length - 3]}${hash[length - 2]}${
    hash[length - 1]
  }`;
  return parseInt(hash, 16);
};

const GetRawTransaction = async (tx_id) => {
  try {
    const response = await Axios("getrawtransaction", [tx_id, true]);
    return response.data.result;
  } catch (error) {
    return false;
  }
};

const GetAmountPaid = (vouts) => {
  let amount = null;
  vouts.forEach((vout) => {
    if (vout.scriptPubKey.address === address) {
      amount = vout.value;
      return;
    } else {
      amount = false;
    }
  });
  return amount;
};

const Decider = (decider) => {
  if (decider % 2 === 0) {
    return true;
  } else {
    return false;
  }
};

const GameProcessor = async (tx_id) => {
  const validator = ValidateTxId(tx_id);
  if (validator) {
    const rawTransaction = await GetRawTransaction(tx_id);
    if (rawTransaction) {
      const amountPaid = GetAmountPaid(rawTransaction.vout);
      if (amountPaid) {
        const userDetails = await GetRawTransaction(rawTransaction.vin[0].txid);
        if (userDetails) {
          const customerAddress =
            userDetails.vout[rawTransaction.vin[0].vout].scriptPubKey.address;
          const decider = Sha512(`${tx_id}${"qwertyuiopasdf"}`);

          return ResHandler(200, "Transaction found", {
            address: Decider(decider),
            decider: decider,
          });
        } else {
        }
      } else {
        return ResHandler(
          401,
          "You did not pay to the Specified Address on the Page"
        );
      }
    } else {
      return ResHandler(
        404,
        "Transaction was mot found in the Mempool nor the blockchain"
      );
    }
  } else {
    return ResHandler(422, "Invalid Transaction Id");
  }
};

module.exports = {
  GetAddress,
  GameProcessor,
};
