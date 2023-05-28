import {newClient} from "./client";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {argument} from "../cli-decorators/argument";

@commandGroup({prefix: "storage-provider", description: "Storage providers operations"})
class StorageProvidersService {
  @command({name: "list", description: "List existing storage providers"})
  public async listStorageProviders() {
    const client = await newClient();

    let spInfo
    try {
      spInfo = await client.sp.getStorageProviders();
    } catch (ex) {
      throw new Error("Unable to get storage providers")
    }

    spInfo.forEach((i) => {
      console.log(`----------------------
                    Endpoint: ${JSON.stringify(i.endpoint)}
                    Operator address: ${JSON.stringify(i.operatorAddress)}
                    Status: ${JSON.stringify(i.status)}
                 ----------------------`);
    });
  }

  @command({name: "get", description: "Get information about storage providers"})
  public async queryStorageProvider(
      @argument({
        description: "Endpoint address",
        alias: "endpoint",
      })
          endpoint: string // "<Storage Provider endpoint>",
  ) {
    const client = await newClient();

    let spArr
    try {
      spArr = await client.sp.getStorageProviders();
    } catch (ex) {
      throw new Error("Unable to fetch storage providers")
    }
    const sp = spArr.find((i) => i.endpoint === endpoint);
    let spInfo
    try {
      spInfo = await client.sp.getStorageProviderInfo(sp.operatorAddress);
    } catch (ex) {
      throw new Error("Unable to get storage provider information")
    }
    console.log(
        `Storage provider by endpoint ${endpoint} is characterized by ${spInfo} and is responding with status ${spInfo.status}.`
    );
  }

  @command({name: "quota-price", description: "Get quota and store price for storage provider endpoint"})
  public async getQuotaPrice(
      @argument({
        description: "Endpoint address",
        alias: "endpoint",
      })
          endpoint: string // "<Storage Provider endpoint>"
  ) {
    const client = await newClient();

    let spArr
    try {
      spArr = await client.sp.getStorageProviders();
    } catch (ex) {
      throw new Error("Unable to fetch storage providers")
    }
    const sp = spArr.find((i) => i.endpoint === endpoint);
    let spTx
    try {
      spTx = await client.sp.getStoragePriceByTime(sp.operatorAddress);
    } catch (ex) {
      throw new Error("Unable to read from storage provider")
    }
    console.log(
        `Quota price is ${spTx.readPrice} and Store price is ${spTx.storePrice} wei`
    );
  }
}
