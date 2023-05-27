// createBucket send the create bucket request to storage provider
import {getBucketNameByUrl} from "./utils";
import {BucketProps, Client, IObjectResultType, Long} from "@bnb-chain/greenfield-chain-sdk";
import {newClient} from "./client";
import {VisibilityType} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import {StorageProvider} from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/types';
import {ConfigService} from "./config";

class BucketService {

  public async createBucket(
      bucketUrl: string,//given in gnfd://bucket_name format
      primarySPFlag?: string,
      chargeQuotaFlag?: number,
      visibilityFlag?: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const sp = await this.getPrimaryStorageProvider(client, primarySPFlag);

    //creating a bucket transaction
    const bucketName = getBucketNameByUrl(bucketUrl);

    let createBucketTx;
    try {
      createBucketTx = await client.bucket.createBucket({
        bucketName: bucketName,
        creator: config.publicKey,
        visibility: visibilityFlag as keyof typeof VisibilityType ?? "VISIBILITY_TYPE_PRIVATE",
        chargedReadQuota: chargeQuotaFlag ? chargeQuotaFlag.toString() : '0',
        spInfo: {
          endpoint: sp.endpoint,
          primarySpAddress: sp.operatorAddress,
          sealAddress: sp.sealAddress,
          secondarySpAddresses: [sp.operatorAddress]
        },
      });
    } catch (ex) {
      throw new Error('Unable to create bucket');
    }

    let simulateCreateBucket;
    try {
      simulateCreateBucket = await createBucketTx.simulate({
        denom: 'BNB',
      });
    } catch (ex) {
      throw new Error('Unable to obtain gas info');
    }

    let transactionHash;
    try {
      const tx = await createBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateCreateBucket.gasLimit),
        gasPrice: simulateCreateBucket.gasPrice,
        payer: config.publicKey,
        granter: "",
        privateKey: config.privateKey,
      });

      transactionHash = tx.transactionHash;
    } catch (ex) {
      throw new Error('Unable to broadcast transaction');
    }

    console.log(`Successfully created bucket "${bucketName}". Transaction: ${transactionHash}`);
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
        visibility: visibilityFlag || "VISIBILITY_TYPE_PRIVATE",
      });
    } catch (ex) {
      throw new Error('Unable to update bucket')
    }

    let simulateUpdateBucket;
    try {
      simulateUpdateBucket = await updateBucketTx.simulate({
        denom: 'BNB',
      });
    } catch (ex) {
      throw new Error('Unable to obtain gas info.')
    }

    let transactionHash;
    try {
      const tx = await updateBucketTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateUpdateBucket.gasLimit),
        gasPrice: simulateUpdateBucket.gasPrice,
        payer: paymentFlag,
        granter: "",
        privateKey: config.privateKey,
      });

      transactionHash = tx.transactionHash;
    } catch (ex) {
      throw new Error('Unable to broadcast transaction');
    }

    console.log(`Successfully updated bucket "${bucketName}". Transaction: ${transactionHash}`);
  }

  public async listBuckets() {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const spInfo = await this.getPrimaryStorageProvider(client);

    let listBucketTx: IObjectResultType<BucketProps[]>;

    try {
      listBucketTx = await client.bucket.getUserBuckets({
        address: config.publicKey,
        endpoint: spInfo.endpoint,
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
    } catch (ex) {
      throw new Error('Unable to delete bucket');
    }

    let simulateDeleteBucket;
    try {
      simulateDeleteBucket = await deleteTx.simulate({
        denom: "BNB",
      });
    } catch (ex) {
      throw new Error('Unable to obtain gas info');
    }

    let deleteBucketTx;
    try {
      deleteBucketTx = await deleteTx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateDeleteBucket.gasLimit),
        gasPrice: simulateDeleteBucket.gasPrice,
        payer: config.publicKey,
        granter: "",
        privateKey: config.privateKey,
      });
    } catch (ex) {
      throw new Error('Unable to broadcast transaction');
    }

    console.log(`Successfully updated bucket "${bucketName}". Transaction: ${deleteBucketTx.transactionHash}`);
  }

  private async getPrimaryStorageProvider(client: Client, address?: string): Promise<StorageProvider> {
    try {
      const spInfo = await client.sp.getStorageProviders();

      if (address) {
        return spInfo.find(sp => sp.operatorAddress == address) ?? spInfo[0];
      }

      return spInfo[0];
    } catch (ex) {
      throw new Error('Unable to obtain primary SP address!')
    }
  }
}