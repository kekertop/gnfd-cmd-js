import * as url from "url";
import {} from "@bnb-chain/greenfield-chain-sdk";

function getPassword(config: string, passwordFileFlag?: string) {}

function getBucketNameByUrl(urlInfo: string): string {
  if (urlInfo.includes("gnfd://")) {
    urlInfo = urlInfo.slice("gnfd://".length);
  }
  const splits = urlInfo.split("/", 1);
  return splits[0];
}

function getGroupNameByUrl(urlInfo: string) {}

function parseActions(actionsFlag?: string, isObjectPolicy?: boolean) {}

function parseBucketAndObject(urlPath: string) {
  if (urlPath.includes("gnfd://")) {
    urlPath = urlPath.slice("gnfd://".length);
  }

  const index = urlPath.indexOf("/");

  if (index < 0) {
    throw new Error("url not right, can not parse bucket name and object name");
  }

  return {
    bucketName: urlPath.slice(0, index),
    objectName: urlPath.slice(index + 1),
  };
}
function getObjAndBucketNames(urlInfo: string) {
  const { bucketName, objectName } = parseBucketAndObject(urlInfo);
  if (!bucketName || !objectName) {
    throw new Error("fail to parse bucket name or object name");
  }
  return { bucketName, objectName };
}
export {
  getPassword,
  getBucketNameByUrl,
  getGroupNameByUrl,
  parseActions,
  parseBucketAndObject,
  getObjAndBucketNames,
};
