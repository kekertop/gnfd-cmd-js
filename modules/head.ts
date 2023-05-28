import { executeTransaction } from "../utils/transactionUtils";
import { newClient } from "./client";
import { ConfigService } from "./config";
import {getBucketNameByUrl, getGroupNameByUrl, parseBucketAndObject} from "./utils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";
import {option} from "../cli-decorators/option";


@commandGroup({ prefix: "head", description: "Head operations" })
class HeadService {
  @command({ name: "object", description: "Send headObject txn to chain && fetch object info on greenfield chain" })
  public async object(
      @argument({
        description: "Object url to get head from",
        alias: "object-url",
      })
      objectUrl: string
  ) {
    const client = await newClient();

    const bucketName = parseBucketAndObject(objectUrl).bucketName
    const objectName = parseBucketAndObject(objectUrl).objectName

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

  @command({ name: "bucket", description: "Send headBucket txn to chain && fetch bucket info on greenfield chain" })
  public async bucket(
      @argument({
        description: "Bucket url to get head from",
        alias: "bucket-url",
      })
      bucketUrl: string
  ) {
    const client = await newClient();

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

  @command({ name: "group", description: "Send headGroup txn to chain && fetch group info on greenfield chain" })
  public async group(
      @argument({
        description: "Group url to get head from",
        alias: "group-url",
      })
      groupUrl: string,
      @option({
        short: "o",
        long: "group-owner-flag",
        description: "Group owner (specify if you are not owner)",
      })
      groupOwner?: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl)
    let headGroupTx
    try {
      headGroupTx = await client.group.headGroup(
          groupName,
          groupOwner || config.publicKey
      );
    } catch(ex) {
      throw new Error("Unable to fetch group info")
    }
    console.log(
        `Successfully found group "${headGroupTx.groupInfo}".`
    );
  }

  @command({ name: "group-member", description: "Get group member" })
  public async groupMember(
      @argument({
        description: "Group url to get head from",
        alias: "group-url",
      })
      groupUrl: string,
      @option({
        short: "o",
        long: "group-owner-flag",
        description: "Group owner (specify if you are not owner)",
      })
      groupOwnerFlag?: string,
      @option({
        short: "m",
        long: "head-member-flag",
        description: "Head member address",
        optionMandatory: true,
      })
      headMemberFlag?: string
  ) {
    if(!headMemberFlag) {
      throw new Error("Head member address is not specified")
    }
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl)
    let headGroupMemberTx
    try {
      headGroupMemberTx = await client.group.headGroupMember(
          groupName,
          groupOwnerFlag || config.publicKey,
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
