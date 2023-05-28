import { getBucketNameByUrl } from "./utils";
import { newClient } from "./client";
import { ConfigService } from "./config";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import {executeTransaction} from "../utils/transactionUtils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";

@commandGroup({ prefix: "storage", description: "Storage operations" })
class StorageProvService {
  @command({ name: "list", description: "List existing storage providers" })
  public async listSP() {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let spInfo
    try {
      spInfo = await client.sp.getStorageProviders();
    } catch(ex) {
      throw new Error("Unable to get storage providers")
    }
    console.log("SP List:")
    spInfo.forEach((i) => {
      console.log(`----------------------
                    Endpoint: ${JSON.stringify(i.endpoint)}
                    Operator address: ${JSON.stringify(i.operatorAddress)}
                    Status: ${JSON.stringify(i.status)}
                 ----------------------`);
    });
  }

  @command({ name: "query", description: "Get information about storage providers" })
  public async querySP(
      @argument({
        description: "endpoint address",
        alias: "endpoint",
      })
      endpoint: string // "<Storage Provider endpoint>",
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let spArr
    try {
      spArr = await client.sp.getStorageProviders();
    } catch(ex) {
      throw new Error("Unable to fetch storage providers")
    }
    const sp = spArr.find((i) => i.endpoint === endpoint);
    let spInfo
    try {
      spInfo = await client.sp.getStorageProviderInfo(sp.operatorAddress);
    } catch(ex) {
      throw new Error("Unable to get storage provider information")
    }
    console.log(
        `Storage provider by endpoint ${endpoint} is characterized by ${spInfo} and is responding with status ${spInfo.status}.`
    );
  }

  @command({ name: "getprice", description: "Get quota and store price for storage provider endpoint" })
  public async getQuotaPrice(
      @argument({
        description: "endpoint address",
        alias: "endpoint",
      })
      endpoint: string // "<Storage Provider endpoint>"
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let spArr
    try {
      spArr = await client.sp.getStorageProviders();
    } catch(ex) {
      throw new Error("Unable to fetch storage providers")
    }
    const sp = spArr.find((i) => i.endpoint === endpoint);
    let spTx
    try {
      spTx = await client.sp.getStoragePriceByTime(sp.operatorAddress);
    } catch(ex) {
      throw new Error("Unable to read from storage provider")
    }
    console.log(
        `Quota price is ${spTx.readPrice} and Store price is ${spTx.storePrice} wei`
    );
  }
}
