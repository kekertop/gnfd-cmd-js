// createBucket send the create bucket request to storage provider
import {getBucketNameByUrl} from "./utils";
import {Client} from "@bnb-chain/greenfield-chain-sdk";
import {VisibilityType} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

const client = Client.create(
    "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
    "5600"
);

const PUBLIC_KEY = "0x54c4F86eFfcecf4A06E70C262f1b762764ee7265"
const PRIVATE_KEY = "0x9b9ef687e5f9d36f3f411c1a13af0993c01b75c729df2dcb5c75782f7e0e2045"

export async function buyQuotaForBucket(
    bucketUrl: string,
    chargeQuotaFlag?: number,
) {
}

export async function getQuotaInfo(
    bucketUrl: string,
) {
    const spInfo = await client.sp.getStorageProviders();
    const transferTx = await client.bucket.getBucketReadQuota({
        bucketName: getBucketNameByUrl(bucketUrl),
        endpoint: spInfo[0].endpoint
    });
    console.log(transferTx)
}

module.exports = {
    buyQuotaForBucket,
    getQuotaInfo,
}