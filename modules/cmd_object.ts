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
const client = Client.create(
  "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
  "5600"
);

function putObject(
  filePath: string, //ArgsUsage: "[filePath] OBJECT-URL"
  secondarySPFlag?: string,
  contentTypeFlag?: string,
  visibilityFlag?: any,
  folderFlag?: string
) {}

function putObjectPolicy(
  objectUrl: string, //ArgsUsage: "[filePath] OBJECT-URL"
  groupIDFlag?: number,
  granteeFlag?: string,
  actionsFlag?: any,
  effectFlag?: string,
  expireTimeFlag?: number
) {}

async function getObject(
  filePath: string,
  objectUrl: string, //ArgsUsage: "[filePath] OBJECT-URL"
  startOffsetFlag?: number,
  endOffsetFlag?: number
) {
  const { bucketName, objectName } = parseBucketAndObject(objectUrl);
  const headObject = await client.object.headObject(bucketName, objectName);
  if (!headObject.objectInfo) {
    throw new Error("Object was not found");
  }
  // If file exist, open it in append mode
  try {
    fs.readFileSync(filePath, { flag: "append" });
  } catch (e) {
    throw new Error(e);
  }
  // flag has been set
  if (startOffsetFlag !== 0 || endOffsetFlag !== 0) {
  }
  const getTx = client.object.getObject({ bucketName, objectName });
  console.log(
    `download object ${objectName} successfully, the file path is ${filePath}`
  );
}

async function cancelCreateObject(objectUrl: string) {
  const config = await ConfigService.getInstance().getConfig();
  const { bucketName, objectName } = parseBucketAndObject(objectUrl);
  try {
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

async function listObjects(bucketUrl: string) {
  const bucketName = getBucketNameByUrl(bucketUrl);
  const knownBucket = await client.bucket.headBucket(bucketName);
  const storageProvider = await client.sp.getStorageProviderInfo(
    knownBucket.bucketInfo.primarySpAddress
  );
  const tx = await client.object.listObjects({
    bucketName,
    endpoint: storageProvider.endpoint,
  });
  console.log(tx);
}

async function createFolder(
  objectUrl: string,
  visibilityFlag?: any,
  objectPrefix?: string
) {
  let { bucketName, objectName } = getObjAndBucketNames(objectUrl);
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

async function updateObject(objectUrl: string, visibilityFlag?: any) {
  const { bucketName, objectName } = parseBucketAndObject(objectUrl);

  if (!visibilityFlag) {
    throw new Error("Visibility must be specified");
  }

  const objectInfo = await client.object.headObject(bucketName, objectName);
}

async function getUploadInfo(objectUrl: string) {
  const { bucketName, objectName } = getObjAndBucketNames(objectUrl);
  const client = await newClient();
  const config = await ConfigService.getInstance().getConfig();
}

module.exports = {
  putObject: putObject,
  putObjectPolicy: putObjectPolicy,
  getObject: getObject,
  cancelCreateObject: cancelCreateObject,
  listObjects: listObjects,
  createFolder: createFolder,
  updateObject: updateObject,
  getUploadInfo: getUploadInfo,
};
