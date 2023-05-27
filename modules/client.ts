import {Client} from "@bnb-chain/greenfield-chain-sdk";
import {ConfigService} from "./config";

export async function newClient(rpcAddr?: string, chainId?: string): Promise<Client> {
  const config = await ConfigService.getInstance().getConfig();

  try  {
    return Client.create(rpcAddr ?? config.rpcAddress, chainId ?? config.chainId);
  } catch (ex) {
    throw new Error('Unable to create new client!');
  }
}