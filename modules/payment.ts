// createBucket send the create bucket request to storage provider
import { getBucketNameByUrl } from "./utils";
import { newClient } from "./client";
import { ConfigService } from "./config";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import {
  executeTransaction,
  getPrimaryStorageProviderInfo,
} from "../utils/transactionUtils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";
import {option} from "../cli-decorators/option";

@commandGroup({ prefix: "payment", description: "Payment operations" })
class PaymentService {
  @command({ name: "buy", description: "Buy quota for bucket" })
  public async buyQuotaForBucket(
      @argument({
        description: "Bucket URL",
        alias: "bucket-url",
      })
      bucketUrl: string,
      @option({
        short: "c",
        long: "charge-quota-flag",
        description: "target quota for the bucket",
        optionMandatory: true,
      })
      chargeQuota?: number
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const spInfo = await client.sp.getStorageProviders();
    let buyQuotaTx
    try {
      //no function in sdk to buy quota
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

  @command({ name: "getinfo", description: "Get info about a bucket quota" })
  public async getQuotaInfo(
      @argument({
        description: "Bucket URL",
        alias: "bucket-url",
      })
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