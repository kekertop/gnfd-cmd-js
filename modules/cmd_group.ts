// createBucket send the create bucket request to storage provider
import { getBucketNameByUrl } from "./utils";
import { newClient } from "./client";
import { ConfigService } from "./config";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import {executeTransaction} from "../utils/transactionUtils";


class GroupService {
  public async createGroup(
      creator: string,
      groupName: string,
      members: string[],
  ) {
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

  public async updateGroupMember(
      groupName: string,
      groupOwner: string,
      membersToAdd: string[],
      membersToDelete: string[],
      operator: string,
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let updateGroupMemberTx
    try {
      updateGroupMemberTx = await client.group.updateGroupMember({
        groupName,
        groupOwner,
        membersToAdd,
        membersToDelete,
        operator,
      });
    } catch(ex) {
      throw new Error("Unable to initialize group member update")
    }
    const response = await executeTransaction(updateGroupMemberTx);
    console.log(
        `Successfully updated group "${groupName}". Transaction: ${response.transactionHash}`
    );
  }

  public async deleteGroup(
      groupName: string,
      operator: string,
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();


    let deleteGroupTx
    try {
      deleteGroupTx = await client.group.deleteGroup({
        groupName,
        operator,
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

