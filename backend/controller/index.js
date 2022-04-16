const axios = require("axios");
const { ResHandler, Axios } = require("../util/index");
const { createHash } = require("crypto");

const address = "tb1qpvf0hh2fmu8pp3mkwwvp38enfwtd534p096vzy";
const fee = 1000;

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

const GetPaymentDetail = (vouts) => {
  let payment_detail = null;
  vouts.forEach((vout) => {
    if (vout.scriptPubKey.address === address) {
      payment_detail = { amount: vout.value, index: vout.n };
      return;
    }
  });
  return payment_detail;
};

const FinalizePsbt = async (body) => {
  try {
    const response = await Axios("finalizepsbt", [body]);
    console.log(response.data);
    return response.data.result.hex;
  } catch (error) {
    return ResHandler(500, "An internal Error Occured");
  }
};

const CreateRawTransaction = async (body) => {
  try {
    const transaction = await Axios("walletcreatefundedpsbt", body);
    return transaction.data.result.psbt;
  } catch (error) {
    return ResHandler(500, "An error occured Please try again laters");
  }
};

const SignRawTransaction = async (body) => {
  try {
    // const response = await Axios("signrawtransactionwithkey", body);
    const response = await Axios("walletprocesspsbt", body);
    // console.log(response);
    // return ResHandler(200, "We are good to go", { privatekey: response });
    return response.data.result.psbt;
  } catch (error) {
    console.log(error.response);
    return ResHandler(500, "An Error occcured, please try again later");
  }
};

const SendRawTransaction = async (body) => {
  try {
    const response = await Axios("sendrawtransaction", [body]);
    console.log(response.data);
  } catch (error) {
    console.log(error.response);
  }
};

const ConvertToSatoshi = (value) => {
  return value * 100000000;
};

const ConvertToBtc = (value) => {
  return value / 100000000;
};

const LoserAmountHandler = (value) => {
  let incomingValue = ConvertToSatoshi(value);
  let amount = ConvertToSatoshi(value) * 0.1;
  let newFee = amount * 0.5;
  let change = incomingValue - (amount + newFee);
  amount = ConvertToBtc(amount);
  change = ConvertToBtc(change);
  return { amount, change };
};

const WinnerHandler = () => {};

const LoserHandler = () => {};

const GetNewAddress = async () => {
  try {
    const response = await Axios("getnewaddress");
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};

const Decider = async (decider, address, tx_id, payment_detail) => {
  const changeAddress = await GetNewAddress();
  if (decider % 2 === 0) {
    return ResHandler(200, "We are good");
  } else {
    const loser = LoserAmountHandler(payment_detail.amount);
    const body = [
      [{ txid: tx_id, vout: payment_detail.index }],
      [
        { [`${address}`]: loser.amount },
        {
          [`${changeAddress}`]: loser.change,
        },
      ],
    ];
    let rawTransaction = await CreateRawTransaction(body);
    let signRawTransaction = await SignRawTransaction([rawTransaction]);
    let finalizePsbt = await FinalizePsbt(signRawTransaction);
    let sendRawTransaction = await SendRawTransaction(finalizePsbt);
    return ResHandler(200, "We are good");
  }
};

const GameProcessor = async (tx_id) => {
  const validator = ValidateTxId(tx_id);
  if (validator) {
    const rawTransaction = await GetRawTransaction(tx_id);
    if (rawTransaction) {
      const paymentDetail = GetPaymentDetail(rawTransaction.vout);
      if (paymentDetail) {
        const userDetails = await GetRawTransaction(rawTransaction.vin[0].txid);
        if (userDetails) {
          const customerAddress =
            userDetails.vout[rawTransaction.vin[0].vout].scriptPubKey.address;
          const decider = Sha512(`${tx_id}${"qwertyuiopasdfg4"}`);
          return Decider(decider, customerAddress, tx_id, paymentDetail);
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
  GetRawTransaction,
};
