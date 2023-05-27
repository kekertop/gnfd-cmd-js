import { newClient } from "./client";
import { ConfigService } from "./config";
import { executeTransaction } from "../utils/transactionUtils";
import {
  MsgMirrorBucket,
  MsgMirrorGroup,
  MsgMirrorObject,
} from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx";
import { Client, TxResponse } from "@bnb-chain/greenfield-chain-sdk";

class CrosschainService {
  public async transferOut(toAddressFlag?: string, amountFlag?: number) {
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

  public async mirror(
    resourceFlag?: string, // object, bucket, group
    idFlag?: string
  ) {
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
