import {Client, ISpInfo, TxResponse} from "@bnb-chain/greenfield-chain-sdk";
import {ConfigService} from "../modules/config";
import {DeliverTxResponse} from "@cosmjs/stargate";
import {StorageProvider} from "@bnb-chain/greenfield-cosmos-types/greenfield/sp/types";

export async function executeTransaction(transactionResponse: TxResponse): Promise<DeliverTxResponse> {
  const config = await ConfigService.getInstance().getConfig();

  let simulateTransferOutTx;
  try {
    simulateTransferOutTx = await transactionResponse.simulate({
      denom: 'BNB'
    });
  } catch (ex) {
    throw new Error('Unable to obtain gas info');
  }

  try {
    return await transactionResponse.broadcast({
      denom: 'BNB',
      gasLimit: Number(simulateTransferOutTx.gasLimit),
      gasPrice: simulateTransferOutTx.gasPrice,
      payer: config.publicKey,
      granter: "",
      privateKey: config.privateKey,
    });
  } catch (ex) {
    throw new Error('Unable to broadcast transaction');
  }
}

export async function getPrimaryStorageProviderInfo(client: Client, address?: string): Promise<ISpInfo> {
  const sp = await getPrimaryStorageProvider(client, address);

  return {
    endpoint: sp.endpoint,
    primarySpAddress: sp.operatorAddress,
    sealAddress: sp.sealAddress,
    secondarySpAddresses: [sp.operatorAddress]
  }
}

export async function getPrimaryStorageProvider(client: Client, address?: string): Promise<StorageProvider> {
  try {
    const spInfo = await client.sp.getStorageProviders();

    if (address) {
      return spInfo.find(sp => sp.operatorAddress == address) ?? spInfo[0];
    }

    return spInfo[0];
  } catch (ex) {
    throw new Error('Unable to obtain primary SP address');
  }
}