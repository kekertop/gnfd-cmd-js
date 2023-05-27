import { executeTransaction } from "../utils/transactionUtils";
import { newClient } from "./client";
import { ConfigService } from "./config";
import { getBucketNameByUrl } from "./utils";

async function headObject(objectUrl: string) {
  const client = await newClient();
  const bucketName = getBucketNameByUrl(objectUrl);
  const tx = await client.object.headObject(bucketName, objectUrl);
  console.log(tx.objectInfo);
}

async function headBucket(bucketUrl: string) {
  const client = await newClient();
  const bucketName = getBucketNameByUrl(bucketUrl);
  const tx = await client.bucket.headBucket(bucketName);
  console.log(tx.bucketInfo);
}

async function headGroup(groupUrl: string, groupOwnerFlag?: string) {
  const client = await newClient();
  const bucketName = getBucketNameByUrl(groupUrl);
  const tx = await client.group.headGroup(bucketName, groupUrl);
  console.log(tx.groupInfo);
}

async function headGroupMember(
  groupUrl: string,
  groupOwnerFlag?: string,
  headMemberFlag?: string
) {
  const client = await newClient();
  const config = await ConfigService.getInstance().getConfig();
  const tx = await client.group.headGroupMember(
    groupUrl,
    groupOwnerFlag,
    headMemberFlag
  );
  console.log(tx.groupMember);
}

module.exports = {
  headObject: headObject,
  headBucket: headBucket,
  headGroup: headGroup,
  headGroupMember: headGroupMember,
};
