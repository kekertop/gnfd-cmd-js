import {promises as fs} from "fs";
import {VisibilityType} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import {ConfigService} from "./config";
import {newClient} from "./client";
import {executeTransaction, getPrimaryStorageProviderInfo} from "../utils/transactionUtils";
import {getBucketNameByUrl, getObjAndBucketNames, parseBucketAndObject,} from "./utils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";
import {option} from "../cli-decorators/option";
import {
  QueryHeadBucketResponse,
  QueryHeadObjectResponse
} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/query";
import {StorageProvider} from "@bnb-chain/greenfield-cosmos-types/greenfield/sp/types";
import {IObjectProps} from "@bnb-chain/greenfield-chain-sdk";
import {IObjectResultType} from "@bnb-chain/greenfield-chain-sdk/dist/esm/types";

@commandGroup({prefix: "object", description: "Object operations"})
class ObjectService {
  @command({name: "get", description: "Get an object"})
  public async getObject(
      @argument({
        description: "Object path",
        alias: "path",
      }) objectPath: string,
      @argument({
        description: "File path",
        alias: "path"
      }) filePath: string
  ) {
    const client = await newClient();

    const {bucketName, objectName} = parseBucketAndObject(objectPath);
    let headObject: QueryHeadObjectResponse;
    let headBucket: QueryHeadBucketResponse;
    let storageProvider: StorageProvider;

    try {
      headObject = await client.object.headObject(bucketName, objectName);
      if (!headObject.objectInfo) {
        throw new Error("Object was not found");
      }

      headBucket = await client.bucket.headBucket(bucketName);
      storageProvider = await client.sp.getStorageProviderInfo(
          headBucket.bucketInfo.primarySpAddress
      );
    } catch (ex) {
      throw new Error("Unable to head object, bucket and storage provider");
    }

    let getTx;
    try {
      getTx = await client.object.getObject({bucketName, objectName, endpoint: storageProvider.endpoint});
    } catch (ex) {
      throw new Error("Unable to fetch the object");
    }

    await fs.writeFile(filePath, Buffer.from(await getTx.body.arrayBuffer()));

    console.log(`Downloaded object ${objectName} successfully. File path: ${filePath}.`);
  }

  @command({name: "list", description: "Lists existing objects"})
  public async listObjects(
      @argument({
        description: "Bucket URL",
        alias: "bucketUrl",
      }) bucketUrl: string
  ) {
    const client = await newClient();

    const bucketName = getBucketNameByUrl(bucketUrl);
    let storageProvider;
    try {
      const knownBucket = await client.bucket.headBucket(bucketName);
      storageProvider = await client.sp.getStorageProviderInfo(
          knownBucket.bucketInfo.primarySpAddress
      );
    } catch (ex) {
      throw new Error("Unable to retrieve storage provider");
    }

    let tx: IObjectResultType<Array<IObjectProps>>;
    try {
      tx = await client.object.listObjects({
        bucketName,
        endpoint: storageProvider.endpoint,
      });
    } catch (ex) {
      throw new Error("Unable to list objects");
    }

    (tx.body ?? [] as IObjectProps[])
    .forEach(obj => console.log(`Name: ${obj.object_info.object_name}. ID: ${obj.object_info.id}. Status: ${obj.object_info.object_status}.`));
  }

  @command({name: "mkdir", description: "creates a new folder"})
  public async createFolder(
      @argument({
        description: "Object URL",
        alias: "objectUrl",
      })
          objectUrl: string,
      @option({
        short: "v",
        long: "visibility",
        description: "Transaction visibility",
        choices: [
          "VISIBILITY_TYPE_UNSPECIFIED",
          "VISIBILITY_TYPE_PUBLIC_READ",
          "VISIBILITY_TYPE_PRIVATE",
          "VISIBILITY_TYPE_INHERIT",
        ]
      }) visibility?: string,
      @option({
        short: "p",
        long: "prefix-object",
        description: "Prefix of the folder to be created"
      }) objectPrefix?: string
  ) {
    let {bucketName, objectName} = getObjAndBucketNames(objectUrl);

    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    objectName = objectName + "/";

    const prefix = objectPrefix;
    if (prefix) {
      objectName = prefix + "/" + objectName;
    }

    try {
      let createFolderTx = await client.object.createFolder({
        bucketName,
        creator: config.publicKey,
        expectSecondarySpAddresses: [],
        objectName,
        spInfo: await getPrimaryStorageProviderInfo(client),
        file: undefined,
        visibility: visibility as keyof typeof VisibilityType ?? 'VISIBILITY_TYPE_PRIVATE'
      });

      const response = await executeTransaction(createFolderTx);

      console.log(
          `Successfully created folder". Transaction: ${response.transactionHash}`
      );
    } catch (ex) {
      throw new Error("Unable to create folder");
    }
  }

  @command({name: "delete", description: "Delete an object"})
  public async deleteObject(
      @argument({
        description: "Object URL",
        alias: "objectUrl",
      })
          objectUrl: string,
  ) {
    const {bucketName, objectName} = parseBucketAndObject(objectUrl);

    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let deleteObjTx;
    try {
      deleteObjTx = await client.object.deleteObject({
        bucketName,
        objectName,
        operator: config.publicKey,
      });
    } catch (ex) {
      throw new Error("Unable to initialize deleting object");
    }

    const response = await executeTransaction(deleteObjTx);
    console.log(
        `Successfully deleted payment account "${objectName}" at bucket ${bucketName}. Transaction: ${response.transactionHash}`
    );
  }
}
