// createBucket send the create bucket request to storage provider
import { getBucketNameByUrl } from "./utils";
import { newClient } from "./client";
import { ConfigService } from "./config";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import {
  executeTransaction,
  getPrimaryStorageProviderInfo,
} from "../utils/transactionUtils";

class PaymentService {
  public async buyQuotaForBucket(
      bucketUrl: string,
      chargeQuotaFlag?: number
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const spInfo = await client.sp.getStorageProviders();
    let buyQuotaTx
    try {
      buyQuotaTx = await client.bucket.getBucketReadQuota({
        bucketName: getBucketNameByUrl(bucketUrl),
        endpoint: spInfo[0].endpoint,
      })
    } catch(ex) {
      throw new Error("Unable to fetch readquota for bucket")
    }
    console.log(
        `Successfully found quota to buy "${buyQuotaTx}".`
    );
  }

  public async getQuotaInfo(
      bucketUrl: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const spInfo = await client.sp.getStorageProviders();
    let getQuotaInfoTx
    try {
        getQuotaInfoTx = await client.bucket.getBucketReadQuota({
        bucketName: getBucketNameByUrl(bucketUrl),
        endpoint: spInfo[0].endpoint,
      });
    } catch(ex) {
      throw new Error("Unable to fetch readquota for bucket")
    }
    console.log(
        `Successfully found quota ${getQuotaInfoTx}".`
    );
  }
}