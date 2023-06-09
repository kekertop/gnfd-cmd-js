import {getGroupNameByUrl} from "../utils/bnbUtils";
import {newClient} from "./client";
import {ConfigService} from "./config";
import {executeTransaction} from "../utils/transactionUtils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";
import {option} from "../cli-decorators/option";


@commandGroup({prefix: "group", description: "Group operations"})
class GroupService {
  @command({name: "create", description: "create group"})
  public async createGroup(
      @argument({
        alias: "group-url",
        description: "Url of the group to be created",
      }) groupUrl: string,
      @option({
        short: "m",
        long: "members",
        description: "Array of members' addresses",
        optionMandatory: true,
        isVariadic: true
      }) members?: string[]
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl);
    let createGroupTx
    try {
      createGroupTx = await client.group.createGroup({
        creator: config.publicKey,
        groupName: groupName,
        members,
      });
    } catch (ex) {
      throw new Error("Unable to create group")
    }
    const response = await executeTransaction(createGroupTx);
    console.log(
        `Successfully created group "${groupName}". Transaction: ${response.transactionHash}`
    );
  }

  @command({name: "update", description: "update group member"})
  public async updateGroupMember(
      @argument({
        description: "Group URL",
        alias: "group-url"
      }) groupUrl: string,
      @option({
        short: "o",
        long: "group-owner",
        description: "Owner of the group",
        optionMandatory: true
      }) groupOwner: string,
      @option({
        short: "a",
        long: "add-members",
        description: "Members to add",
        isVariadic: true,
        optionMandatory: true,
      }) membersToAdd?: string[],
      @option({
        short: "r",
        long: "remove-members",
        description: "Members to delete",
        isVariadic: true,
        optionMandatory: true,
      }) membersToDelete?: string[]
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl)

    let updateGroupMemberTx
    try {
      updateGroupMemberTx = await client.group.updateGroupMember({
        groupName: groupName,
        groupOwner: groupOwner,
        membersToAdd: membersToAdd,
        membersToDelete: membersToDelete,
        operator: config.publicKey,
      });
    } catch (ex) {
      throw new Error("Unable to initialize group member update")
    }

    const response = await executeTransaction(updateGroupMemberTx);
    console.log(
        `Successfully updated group "${groupName}". Transaction: ${response.transactionHash}`
    );
  }

  @command({name: "delete", description: "Delete the group"})
  public async deleteGroup(
      @argument({
        description: "Group name",
        alias: "group-name",
      }) groupUrl: string,
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    const groupName = getGroupNameByUrl(groupUrl);
    let deleteGroupTx
    try {
      deleteGroupTx = await client.group.deleteGroup({
        groupName: groupName,
        operator: config.publicKey
      });
    } catch (ex) {
      throw new Error("Unable to initialize group deletion")
    }

    const response = await executeTransaction(deleteGroupTx);
    console.log(
        `Successfully deleted group "${groupName}". Transaction: ${response.transactionHash}`
    );
  }
}

