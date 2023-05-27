// createBucket send the create bucket request to storage provider
import {getBucketNameByUrl} from "./utils";
import {Client, Long} from "@bnb-chain/greenfield-chain-sdk";
import {VisibilityType} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

const client = Client.create(
    "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
    "5600"
);

const PUBLIC_KEY = "0x54c4F86eFfcecf4A06E70C262f1b762764ee7265"
const PRIVATE_KEY = "0x9b9ef687e5f9d36f3f411c1a13af0993c01b75c729df2dcb5c75782f7e0e2045"

export async function createBucket(
    bucketUrl: string,//given in gnfd://bucket_name format
    primarySPFlag?: string,
    paymentFlag?: string,
    chargeQuotaFlag?: number,
    visibilityFlag?: any
) {
    const spInfo = await client.sp.getStorageProviders();
    //creating a bucket transaction
    const createBucketTx = await client.bucket.createBucket({
        bucketName: getBucketNameByUrl(bucketUrl),
        creator: PUBLIC_KEY,
        visibility: visibilityFlag || "VISIBILITY_TYPE_PRIVATE",
        chargedReadQuota: "0", // strangely any other flag leads to errors chargeQuotaFlag.toString() || "0"
        spInfo: {
            endpoint: spInfo[0].endpoint,
            primarySpAddress: primarySPFlag || spInfo[0].operatorAddress,
            sealAddress: spInfo[0].sealAddress,
            secondarySpAddresses: spInfo.slice(1).map((i) => i.operatorAddress),
        },
    })
    //broadcasting
    const simulateCreateBucket = await createBucketTx.simulate({
        denom: 'BNB',
    });
    const broadcastRes = await createBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateCreateBucket.gasLimit),
        gasPrice: simulateCreateBucket.gasPrice,
        payer: paymentFlag || PUBLIC_KEY,
        granter: "",
        privateKey: PRIVATE_KEY,
    });
}

// updateBucket send the create bucket request to storage provider
export async function updateBucket(
    bucketUrl: string,
    paymentFlag?: string,
    chargeQuotaFlag?: any, //UInt64Value
    visibilityFlag?: any,
) {
    //creating an update bucket transaction
    const updateBucketTx = await client.bucket.updateBucketInfo({
        operator: PUBLIC_KEY,
        bucketName: getBucketNameByUrl(bucketUrl),
        chargedReadQuota: {
            value: new Long(chargeQuotaFlag || 0)
        }, // strangely any other flag leads to errors chargeQuotaFlag.toString() || "0"
        paymentAddress: paymentFlag || PUBLIC_KEY,
        visibility: visibilityFlag || "VISIBILITY_TYPE_PRIVATE",
    })
    //broadcasting
    const simulateUpdateBucket = await updateBucketTx.simulate({
        denom: 'BNB',
    });
    const broadcastRes = await updateBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateUpdateBucket.gasLimit),
        gasPrice: simulateUpdateBucket.gasPrice,
        payer: paymentFlag || PUBLIC_KEY,
        granter: "",
        privateKey: PRIVATE_KEY,
    });
}

// listBuckets list the buckets of the specific owner
export function listBuckets() {

}

export function putBucketPolicy(
    bucketUrl: string,
    groupIDFlag?: number,
    granteeFlag?: string,
    actionsFlag?: string,
    effectFlag?: any,
    expireTimeFlag?: number,
) {

}