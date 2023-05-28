// createBucket send the create bucket request to storage provider
import {getBucketNameByUrl, getGroupNameByUrl} from "./utils";
import { newClient } from "./client";
import { ConfigService } from "./config";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import {executeTransaction} from "../utils/transactionUtils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";
import {option} from "../cli-decorators/option";


@commandGroup({ prefix: "group", description: "Group operations" })
class GroupService {
  @command({ name: "create", description: "create group" })
  public async createGroup(
      @argument({
        description: "creator account address",
        alias: "creator",
      })
      creator: string,
      @option({
        short: "n",
        long: "name",
        description: "name of the created group",
      })
      groupName?: string,
      @option({
        short: "m",
        long: "members",
        description: "array of members' addresses",
      })
      members?: string[],
  ) {
    if(!groupName || !members) {
      throw new Error("Name of the group and members are not specified")
    }
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let createGroupTx
    try {
      createGroupTx = await client.group.createGroup({
        creator,
        groupName,
        members,
      });
    } catch(ex) {
      throw new Error("Unable to initialize group creation")
    }
    const response = await executeTransaction(createGroupTx);
    console.log(
        `Successfully created group "${groupName}". Transaction: ${response.transactionHash}`
    );
  }

  @command({ name: "update", description: "update group member" })
  public async updateGroupMember(
      @argument({
        description: "group URL",
        alias: "group-url",
      })
      groupUrl: string,
      @option({
        short: "a",
        long: "add-members-flag",
        description: "members to add separated by comma",
      })
      addMemberFlag?: string,
      @option({
        short: "r",
        long: "remove-members-flag",
        description: "members to delete separated by comma",
      })
      removeMemberFlag?: string,
      @option({
        short: "o",
        long: "group-owner-flag",
        description: "owner of the group",
      })
      groupOwnerFlag?: string,
  ) {
    if(!addMemberFlag || !removeMemberFlag || !groupOwnerFlag) {
      throw new Error("Group owner, New members, or Old members are not specified")
    }
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl)
    const membersToAdd : string[] = addMemberFlag.split("");
    const membersToDelete : string[] = removeMemberFlag.split("");
    let updateGroupMemberTx
    try {
      updateGroupMemberTx = await client.group.updateGroupMember({
        groupName,
        groupOwner: groupOwnerFlag,
        membersToAdd,
        membersToDelete,
        operator: config.publicKey,
      });
    } catch(ex) {
      throw new Error("Unable to initialize group member update")
    }
    const response = await executeTransaction(updateGroupMemberTx);
    console.log(
        `Successfully updated group "${groupName}". Transaction: ${response.transactionHash}`
    );
  }

  @command({ name: "delete", description: "delete the group" })
  public async deleteGroup(
      @argument({
        description: "group name",
        alias: "group-name",
      })
      groupName: string,
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();


    let deleteGroupTx
    try {
      deleteGroupTx = await client.group.deleteGroup({
        groupName,
        operator: config.publicKey
      });
    } catch(ex) {
      throw new Error("Unable to initialize group deletion")
    }

    const response = await executeTransaction(deleteGroupTx);
    console.log(
        `Successfully deleted group "${groupName}". Transaction: ${response.transactionHash}`
    );
  }
}

