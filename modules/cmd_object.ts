import { Client } from "@bnb-chain/greenfield-chain-sdk";
import fs from "fs";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import { ConfigService } from "./config";
import { newClient } from "./client";
import { executeTransaction } from "../utils/transactionUtils";
import {
  getBucketNameByUrl,
  getObjAndBucketNames,
  parseBucketAndObject,
} from "./utils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";
import {option} from "../cli-decorators/option";

@commandGroup({ prefix: "object", description: "Object operations" })
class ObjectService {
  @command({ name: "put", description: "create an object on-chain" })
  public async putObject(
      @argument({
        description: "Object filepath",
        alias: "object-filepath",
      })
      filePath: string, //ArgsUsage: "[filePath] OBJECT-URL"
      @option({
        short: "s",
        long: "secondary-sp-flag",
        description: "Secondary storage flag",
        optionMandatory: true,
      })
      secondarySPFlag?: string,
      @option({
        short: "c",
        long: "content-type-flag",
        description: "Content type flag",
        optionMandatory: true,
      })
      contentTypeFlag?: string,
      @option({
        short: "v",
        long: "visibility",
        description: "Transaction visibility",
        choices: [
          "VISIBILITY_TYPE_UNSPECIFIED",
          "VISIBILITY_TYPE_PUBLIC_READ",
          "VISIBILITY_TYPE_PRIVATE",
          "VISIBILITY_TYPE_INHERIT",
        ],
        optionMandatory: true,
      })
      visibilityFlag?: any,
      @option({
        short: "f",
        long: "folder-flag",
        description: "Folder where object is uploaded",
        optionMandatory: true,
      })
      folderFlag?: string
  ) {
    //implementation
    console.log(`Successfully put object`)
  }

  @command({ name: "putpol", description: "put object policy to group/account" })
  public async putObjectPolicy(
      @argument({
        description: "Object Url",
        alias: "objectUrl",
      })
      objectUrl: string, //ArgsUsage: "[filePath] OBJECT-URL"
      @option({
        short: "g",
        long: "group-id-flag",
        description: "group id of the group",
        optionMandatory: true,
      })
      groupIDFlag?: number,
      @option({
        short: "r",
        long: "grantee-flag",
        description: "address hex string of the grantee",
        optionMandatory: true,
      })
      granteeFlag?: string,
      @option({
        short: "a",
        long: "action",
        description: "Set the action of the policy",
        choices: [
          "CREATE",
          "DELETE",
          "COPY",
          "GET",
          "EXECUTE",
          "LIST",
          "ALL"
        ],
        optionMandatory: true,
      })
      actionsFlag?: string,
      @option({
        short: "f",
        long: "effect-flag",
        description: "Effect of the new policy",
        optionMandatory: true,
      })
      effectFlag?: string,
      @option({
        short: "e",
        long: "expire-time",
        description: "Expire time of the new policy",
        choices: [
          "EFFECT_ALLOW",
          "EFFECT_DENY",
        ],
        optionMandatory: true,
      })
      expireTimeFlag?: number
  ) {
    console.log(`Successfully applied a new object policy to ${objectUrl}`)
  }

  @command({ name: "get", description: "Get an object" })
  public async getObject(
      @argument({
        description: "Object filepath",
        alias: "object-filepath",
      })
      filePath: string, //ArgsUsage: "[filePath] OBJECT-URL"
      @option({
        short: "s",
        long: "start-offset-flag",
        description: "Primary storage provider URL",
      })
      startOffsetFlag?: number,
      @option({
        short: "e",
        long: "end-offset-flag",
        description: "Primary storage provider URL",
      })
      endOffsetFlag?: number
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const {bucketName, objectName} = parseBucketAndObject(filePath);
    let headObject
    try {
      headObject = await client.object.headObject(bucketName, objectName);
    } catch(ex) {
      throw new Error("Unable to get head object")
    }
    if (!headObject.objectInfo) {
      throw new Error("Object was not found");
    }
    // If file exist, open it in append mode
    try {
      fs.readFileSync(filePath, {flag: "append"});
    } catch (e) {
      throw new Error(e);
    }
    // flag has been set
    try {
      const getTx = await client.object.getObject({bucketName, objectName});
    } catch(ex) {
      throw new Error("Unable to fetch the object")
    }
    console.log(
        `Downloaded object ${objectName} successfully, the file path is ${filePath}`
    );
  }

  @command({ name: "cancel", description: "Cancel an object creation" })
  public async cancelCreateObject(
      @argument({
        description: "Object Url",
        alias: "objectUrl",
      })
      objectUrl: string,
  ) {
    const config = await ConfigService.getInstance().getConfig();
    const {bucketName, objectName} = parseBucketAndObject(objectUrl);
    try {
      const client = await newClient();
      const config = await ConfigService.getInstance().getConfig();

      const tx = await client.object.cancelCreateObject({
        bucketName,
        objectName,
        operator: config.publicKey,
      });
      const response = await executeTransaction(tx);
      console.log(
          `Successfully cancelled object creation". Transaction: ${response.transactionHash}`
      );
    } catch (ex) {
      throw new Error("Unable to cancel object creation");
    }
  }

  @command({ name: "list", description: "Lists existing objects" })
  public async listObjects(
      @argument({
        description: "Bucket Url",
        alias: "bucketUrl",
      })
      bucketUrl: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const bucketName = getBucketNameByUrl(bucketUrl);
    let storageProvider
    try {
      const knownBucket = await client.bucket.headBucket(bucketName);
      storageProvider = await client.sp.getStorageProviderInfo(
          knownBucket.bucketInfo.primarySpAddress
      );
    } catch(ex) {
      throw new Error("Unable to retreive storage provider")
    }
    let tx
    try {
      tx = await client.object.listObjects({
        bucketName,
        endpoint: storageProvider.endpoint,
      });
    } catch(ex) {
      throw new Error("Unable to list objects")
    }
    console.log("Objects:")
    console.log(tx);
  }

  @command({ name: "createfolder", description: "creates a new folder" })
  public async createFolder(
      @argument({
        description: "Object Url",
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
        ],
        optionMandatory: true,
      })
      visibilityFlag?: string,
      @option({
        short: "p",
        long: "prefix-object",
        description: "Prefix of the folder to be created",
        optionMandatory: true,
      })
      objectPrefix?: string
  ) {
    let {bucketName, objectName} = getObjAndBucketNames(objectUrl);
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    if (
        !visibilityFlag ||
        Object.values(VisibilityType).includes(visibilityFlag)
    ) {
      throw new Error("Visibility is set to a value that is not allowed");
    }
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
        spInfo: {
          endpoint: "",
          sealAddress: "",
          secondarySpAddresses: [],
        },
        file: new File([""], "file.txt"),
      });

      const response = await executeTransaction(createFolderTx);

      console.log(
          `Successfully created folder". Transaction: ${response.transactionHash}`
      );
    } catch (ex) {
      throw new Error("Unable to create folder");
    }
  }

  @commandGroup({ prefix: "update", description: "Update an object" })
  public async updateObject(
      @argument({
        description: "Object Url",
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
        ],
        optionMandatory: true
      })
      visibilityFlag?: string
  ) {
    const {bucketName, objectName} = parseBucketAndObject(objectUrl);
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    try {
      const objectInfo = await client.object.headObject(bucketName, objectName);
    } catch(ex) {
      throw new Error("Unable to get object head")
    }
  }

  @commandGroup({ prefix: "getUploadInfo", description: "Get the upload progress" })
  public async getUploadInfo(
      @argument({
        description: "Object Url",
        alias: "objectUrl",
      })
      objectUrl: string
  ) {
    const {bucketName, objectName} = getObjAndBucketNames(objectUrl);
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();
    //getting upload info
    console.log(`Successfully got the information about the ${objectUrl}`)
  }
}