import { executeTransaction } from "../utils/transactionUtils";
import { newClient } from "./client";
import { ConfigService } from "./config";
import {getBucketNameByUrl, getGroupNameByUrl, parseBucketAndObject} from "./utils";


class HeadService {
  public async headObject(
      objectUrl: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();
    const bucketName = parseBucketAndObject(objectUrl)[0]
    const objectName = parseBucketAndObject(objectUrl)[1]

    let headObjectTx
    try {
      headObjectTx = await client.object.headObject(
          bucketName,
          objectName
      );
    } catch(ex) {
      throw new Error("Unable to fetch object info")
    }
    console.log(
        `Successfully found object "${headObjectTx.objectInfo}".`
    );
  }

  public async headBucket(
      bucketUrl: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const bucketName = getBucketNameByUrl(bucketUrl);
    let headBucketTx
    try {
      headBucketTx = await client.bucket.headBucket(bucketName);
    } catch(ex) {
      throw new Error("Unable to fetch bucket info")
    }
    console.log(
        `Successfully found bucket "${headBucketTx.bucketInfo}".`
    );
  }

  public async headGroup(
      groupUrl: string,
      groupOwnerFlag: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl)
    let headGroupTx
    try {
      headGroupTx = await client.group.headGroup(groupName, groupOwnerFlag);
    } catch(ex) {
      throw new Error("Unable to fetch group info")
    }
    console.log(
        `Successfully found group "${headGroupTx.groupInfo}".`
    );
  }

  public async headGroupMember(
      groupUrl: string,
      groupOwnerFlag?: string,
      headMemberFlag?: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl)
    let headGroupMemberTx
    try {
      headGroupMemberTx = await client.group.headGroupMember(
          groupName,
          groupOwnerFlag,
          headMemberFlag
      );
    } catch(ex) {
      throw new Error("Unable to fetch group member info")
    }
    console.log(
        `Successfully found group member "${headGroupMemberTx.groupMember}".`
    );
  }
}
