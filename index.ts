const { Client } = require("@bnb-chain/greenfield-chain-sdk");
const fs = require("fs");

const client = Client.create(
  "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
  "5600"
);

// (async () => {
//   const filePath = './package.json';
//   const fileBuf = fs.readFileSync(filePath);
//   const DEFAULT_SEGMENT_SIZE = 16 * 1024 * 1024;
//   const DEFAULT_DATA_BLOCKS = 4;
//   const DEFAULT_PARITY_BLOCKS = 2;
//   const bytes = new Uint8Array(fileBuf);

//   const hashResult = await getCheckSums(
//     Buffer.from(bytes).toString('hex'),
//     DEFAULT_SEGMENT_SIZE,
//     DEFAULT_DATA_BLOCKS,
//     DEFAULT_PARITY_BLOCKS,
//   );
//   console.log('hashResult', hashResult);
// })();

(async () => {
  const balance = await client.account.getAccountBalance({
    address: "0x54c4F86eFfcecf4A06E70C262f1b762764ee7265",
    denom: "BNB",
  });
  console.log(balance.balance.amount.toString());
})();
