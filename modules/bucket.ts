// createBucket send the create bucket request to storage provider
import {getBucketNameByUrl} from "./utils";
import {BucketProps, IObjectResultType, Long} from "@bnb-chain/greenfield-chain-sdk";
import {newClient} from "./client";
import {VisibilityType} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import {ConfigService} from "./config";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";
import {option} from "../cli-decorators/option";
import {executeTransaction, getPrimaryStorageProviderInfo} from "../utils/transactionUtils";

@commandGroup({prefix: 'bucket', description: 'Bucket operations'})
class BucketService {

  @command({name: 'create', description: 'Create bucket'})
  public async createBucket(
      @argument({
        description: 'Bucket URL',
        alias: 'bucket-url'
      }) bucketUrl: string,
      @option({
        short: 's',
        long: 'primary-storage-provider',
        description: 'Primary storage provider URL'
      }) primarySPFlag?: string,
      @option({
        short: 'q',
        long: 'charge-quota',
        description: 'Charge quota'
      }) chargeQuotaFlag?: number,
      @option({
        short: 'v',
        long: 'visibility',
        description: 'Transaction visibility',
        choices: ['VISIBILITY_TYPE_UNSPECIFIED', 'VISIBILITY_TYPE_PUBLIC_READ', 'VISIBILITY_TYPE_PRIVATE', 'VISIBILITY_TYPE_INHERIT']
      })
      visibilityFlag?: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const bucketName = getBucketNameByUrl(bucketUrl);

    try {
      const createBucketTx = await client.bucket.createBucket({
        bucketName: bucketName,
        creator: config.publicKey,
        visibility: visibilityFlag as keyof typeof VisibilityType ?? "VISIBILITY_TYPE_PRIVATE",
        chargedReadQuota: chargeQuotaFlag ? chargeQuotaFlag.toString() : '0',
        spInfo: await getPrimaryStorageProviderInfo(client, primarySPFlag),
      });

      const response = await executeTransaction(createBucketTx);

      console.log(`Successfully created bucket "${bucketName}". Transaction: ${response.transactionHash}`);
    } catch (ex) {
      throw new Error('Unable to create bucket');
    }
  }

  public async updateBucket(
      bucketUrl: string,
      paymentFlag?: string,
      chargeQuotaFlag?: number,
      visibilityFlag?: any,
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const bucketName = getBucketNameByUrl(bucketUrl);

    let updateBucketTx;
    try {
      updateBucketTx = await client.bucket.updateBucketInfo({
        operator: config.publicKey,
        bucketName: bucketName,
        chargedReadQuota: {
          value: new Long(chargeQuotaFlag ?? 0)
        },
        paymentAddress: paymentFlag ?? '',
        visibility: visibilityFlag || "VISIBILITY_TYPE_PRIVATE"
      });

      const response = await executeTransaction(updateBucketTx);

      console.log(`Successfully updated bucket "${bucketName}". Transaction: ${response.transactionHash}`);
    } catch (ex) {
      throw new Error('Unable to update bucket')
    }
  }

  public async listBuckets() {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let listBucketTx: IObjectResultType<BucketProps[]>;

    try {
      listBucketTx = await client.bucket.getUserBuckets({
        address: config.publicKey,
        endpoint: (await getPrimaryStorageProviderInfo(client)).endpoint
      });
    } catch (ex) {
      throw new Error('Unable to retrieve buckets.');
    }

    if (!listBucketTx.body || listBucketTx.body.length == 0) {
      console.log('Empty')
    }

    listBucketTx.body.forEach(bucket => {
      console.log(`Bucket name: ${bucket.bucket_info.bucket_name}; Bucket id: ${bucket.bucket_info.id}`);
    });
  }

  public async deleteBucket(
      bucketUrl: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const bucketName = getBucketNameByUrl(bucketUrl);

    let deleteTx
    try {
      deleteTx = await client.bucket.deleteBucket({
        operator: config.publicKey,
        bucketName: bucketName,
      });

      const response = await executeTransaction(deleteTx);

      console.log(`Successfully updated bucket "${bucketName}". Transaction: ${response.transactionHash}`);
    } catch (ex) {
      throw new Error('Unable to delete bucket');
    }
  }
}