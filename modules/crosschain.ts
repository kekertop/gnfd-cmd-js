import { newClient } from "./client";
import { ConfigService } from "./config";
import { executeTransaction } from "../utils/transactionUtils";
import {
  MsgMirrorBucket,
  MsgMirrorGroup,
  MsgMirrorObject,
} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx";
import { Client, TxResponse } from "@bnb-chain/greenfield-chain-sdk";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {option} from "../cli-decorators/option";

@commandGroup({ prefix: "cc", description: "Cross-Chain operations" })
class CrosschainService {
  @command({ name: "tout", description: "Transfer BNB from Greenfield to BSC account" })
  public async transferOut(
      @option({
        short: "t",
        long: "to-address-flag",
        description: "receiver address in Binance Smart Chain",
      })
      toAddressFlag?: string,
      @option({
        short: "a",
        long: "amount",
        description: "amount of BNB to send",
      })
      amountFlag?: number
  ) {
    if(!toAddressFlag || !amountFlag) {
      throw new Error("Address or amount is not specified")
    }
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferOutTx;
    try {
      transferOutTx = await client.crosschain.transferOut({
        from: config.publicKey,
        to: toAddressFlag,
        amount: {
          denom: "BNB",
          amount: amountFlag.toString() ?? "0",
        },
      });

      const response = await executeTransaction(transferOutTx);

      console.log(
        `Successfully transferred out ${amountFlag} BNB to ${toAddressFlag}. Transaction hash: ${response.transactionHash}`
      );
    } catch (ex) {
      throw new Error("Unable to transfer out");
    }
  }

  @command({ name: "mirror", description: "mirror resource to BSC" })
  public async mirror(
      @option({
        short: "r",
        long: "resource",
        description: "type of resource (object, bucket, or group)",
      })
      resourceFlag?: string, // object, bucket, group
      @option({
        short: "i",
        long: "id",
        description: "resource id",
      })
      idFlag?: string
  ) {
    if(!resourceFlag || !idFlag) {
      throw new Error("resource type or id is not specified")
    }
    const client = await newClient();

    let mirrorTx;
    try {
      const parameters: MsgMirrorObject | MsgMirrorGroup | MsgMirrorBucket = {
        id: idFlag,
        operator: "",
      };

      mirrorTx = await this.mirrorInternal(client, resourceFlag, parameters);

      const response = await executeTransaction(mirrorTx);

      console.log(
        `Successfully mirrored ${resourceFlag} with ID ${idFlag}. Transaction hash: ${response.transactionHash}`
      );
    } catch (ex) {
      throw new Error("Unable to transfer out");
    }
  }

  private async mirrorInternal(
    client: Client,
    resourceType: string,
    props: MsgMirrorObject | MsgMirrorGroup | MsgMirrorBucket
  ): Promise<TxResponse> {
    switch (resourceType) {
      case "object":
        return await client.crosschain.mirrorObject(props);
      case "group":
        return await client.crosschain.mirrorGroup(props);
      case "bucket":
        return await client.crosschain.mirrorBucket(props);
    }
  }
}
