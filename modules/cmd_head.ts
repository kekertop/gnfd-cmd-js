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
  @command({ name: "headobj", description: "Get object head" })
  public async headObject(
      @argument({
        description: "object url to get head from",
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

  @command({ name: "headbucket", description: "Get bucket head" })
  public async headBucket(
      @argument({
        description: "bucket url to get head from",
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

  @command({ name: "headgroup", description: "Get group head" })
  public async headGroup(
      @argument({
        description: "group url to get head from",
        alias: "group-url",
      })
      groupUrl: string,
      @option({
        short: "o",
        long: "group-owner-flag",
        description: "Group owner (specify if you are not owner)",
      })
      groupOwnerFlag?: string
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl)
    let headGroupTx
    try {
      headGroupTx = await client.group.headGroup(
          groupName,
          groupOwnerFlag || config.publicKey
      );
    } catch(ex) {
      throw new Error("Unable to fetch group info")
    }
    console.log(
        `Successfully found group "${headGroupTx.groupInfo}".`
    );
  }

  @command({ name: "headgroupmember", description: "Get group member" })
  public async headGroupMember(
      @argument({
        description: "group url to get head from",
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
        description: "head member address",
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
