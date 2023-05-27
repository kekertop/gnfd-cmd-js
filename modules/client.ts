import {Client} from "@bnb-chain/greenfield-chain-sdk";
import {ConfigService} from "../utils/config";

export async function newClient(rpcAddr?: string, chainId?: string): Promise<Client> {
  const config = await ConfigService.getInstance().getConfig();

  return Client.create(rpcAddr ?? config.rpcAddress, chainId ?? config.chainId);
}