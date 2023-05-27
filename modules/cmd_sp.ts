import { getBucketNameByUrl } from "./utils";
import { Client, Long } from "@bnb-chain/greenfield-chain-sdk";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

const client = Client.create(
  "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
  "5600"
);

async function listSP() {
  const spInfo = await client.sp.getStorageProviders();
  spInfo.forEach((i) => {
    console.log(`----------------------
                    ${JSON.stringify(i)}}
                 ----------------------`);
  });
}

async function querySP(
  endpoint: string // "<Storage Provider endpoint>",
) {
  const spArr = await client.sp.getStorageProviders();
  const sp = spArr.find((i) => i.endpoint === endpoint);
  const spInfo = await client.sp.getStorageProviderInfo(sp.operatorAddress);
  console.log(spInfo);
}

async function getQuotaPrice(
  endpoint: string // "<Storage Provider endpoint>"
) {
  const spInfo = await client.sp.getStorageProviders();
  const sp = spInfo.find((i) => i.endpoint === endpoint);
  const spTx = await client.sp.getStoragePriceByTime(sp.operatorAddress);
  console.log("Quota price", spTx.readPrice);
  console.log("Store price", spTx.storePrice);
}

module.exports = {
  listSP,
  querySP,
  getQuotaPrice,
};
