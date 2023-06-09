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
        optionMandatory: true,
      })
      toAddress?: string,
      @option({
        short: "a",
        long: "amount",
        description: "amount of BNB to send",
        optionMandatory: true,
      })
      amount?: number
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferOutTx;
    try {
      transferOutTx = await client.crosschain.transferOut({
        from: config.publicKey,
        to: toAddress,
        amount: {
          denom: "BNB",
          amount: amount.toString() ?? "0",
        },
      });

      const response = await executeTransaction(transferOutTx);

      console.log(
        `Successfully transferred out ${amount} BNB to ${toAddress}. Transaction hash: ${response.transactionHash}`
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
        choices: [
          "OBJECT",
          "GROUP",
          "BUCKET",
        ],
        optionMandatory: true,
      }) resource?: string, // object, bucket, group
      @option({
        short: "i",
        long: "id",
        description: "resource id",
        optionMandatory: true,
      }) id?: string
  ) {
    const client = await newClient();

    let mirrorTx;
    try {
      const parameters: MsgMirrorObject | MsgMirrorGroup | MsgMirrorBucket = {
        id: id,
        operator: "",
      };

      mirrorTx = await this.mirrorInternal(client, resource, parameters);

      const response = await executeTransaction(mirrorTx);

      console.log(
        `Successfully mirrored ${resource} with ID ${id}. Transaction hash: ${response.transactionHash}`
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
      case "OBJECT":
        return await client.crosschain.mirrorObject(props);
      case "GROUP":
        return await client.crosschain.mirrorGroup(props);
      case "BUCKET":
        return await client.crosschain.mirrorBucket(props);
    }
  }
}
