import { getBucketNameByUrl } from "./utils";
import { Client } from "@bnb-chain/greenfield-chain-sdk";
import { newClient } from "./client";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";
import { StorageProvider } from "@bnb-chain/greenfield-cosmos-types/greenfield/sp/types";
import { ConfigService } from "./config";

const DEFAULT_ACCOUNT = "0x22ED18D6c79f91ba186b23f1920Df4a2f2Ca1E3B";

class AccountService {
  public async createPaymentAccount() {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferTx;
    try {
      transferTx = await client.account.createPaymentAccount({
        creator: config.publicKey,
      });
    } catch (ex) {
      throw new Error("Unable to create payment account");
    }

    let simulateInfo;
    try {
      simulateInfo = await transferTx.simulate({
        denom: "BNB",
      });
    } catch (ex) {
      throw new Error("Unable to obtain gas fees");
    }

    let transactionHash;
    try {
      const broadcastRes = await transferTx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: config.publicKey,
        granter: "",
        privateKey: config.privateKey,
      });

      transactionHash = broadcastRes.transactionHash;
    } catch (ex) {
      throw new Error("Unable to broadcast transaction");
    }

    console.log(
      `Successfully created payment account for stream account "${config.publicKey}". Transaction: ${transactionHash}`
    );
  }

  public async deposit(toAddressFlag: string, amountFlag: string) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferTx;
    try {
      transferTx = await client.payment.deposit({
        creator: config.publicKey,
        to: toAddressFlag,
        amount: amountFlag,
      });
    } catch (ex) {
      throw new Error("Unable to initialize deposit to payment account");
    }

    let simulateInfo;
    try {
      simulateInfo = await transferTx.simulate({
        denom: "BNB",
      });
    } catch (ex) {
      throw new Error("Unable to obtain gas fees");
    }

    let transactionHash;
    try {
      const broadcastRes = await transferTx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: config.publicKey,
        granter: "",
        privateKey: config.privateKey,
      });

      transactionHash = broadcastRes.transactionHash;
    } catch (ex) {
      throw new Error("Unable to broadcast transaction");
    }

    console.log(
      `Successfully deposited "${amountFlag}" to "${toAddressFlag}" payment account. Transaction: ${transactionHash}`
    );
  }

  public async withdraw(fromAddressFlag: string, amountFlag: string) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferTx;
    try {
      transferTx = await client.payment.withdraw({
        creator: config.publicKey,
        from: fromAddressFlag,
        amount: amountFlag,
      });
    } catch (ex) {
      throw new Error("Unable to initialize withdraw from payment account");
    }

    let simulateInfo;
    try {
      simulateInfo = await transferTx.simulate({
        denom: "BNB",
      });
    } catch (ex) {
      throw new Error("Unable to obtain gas fees");
    }

    let transactionHash;
    try {
      const broadcastRes = await transferTx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: config.publicKey,
        granter: "",
        privateKey: config.privateKey,
      });

      transactionHash = broadcastRes.transactionHash;
    } catch (ex) {
      throw new Error("Unable to broadcast transaction");
    }

    console.log(
      `Successfully withdrew "${amountFlag}" from "${fromAddressFlag}" payment account. Transaction: ${transactionHash}`
    );
  }

  public async listPaymentAccounts(ownerAddressFlag?: string) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferTx;
    try {
      transferTx = await client.account.getPaymentAccountsByOwner(
        ownerAddressFlag || DEFAULT_ACCOUNT
      );
    } catch (ex) {
      throw new Error("Cannot get payments accounts by owner");
    }
    console.log(transferTx.paymentAccounts);
  }

  public async getAccountBalance(addressFlag?: string) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferTx;
    try {
      transferTx = await client.account.getAccountBalance({
        address: addressFlag || DEFAULT_ACCOUNT,
        denom: "BNB",
      });
    } catch (ex) {
      throw new Error("Unable to retrieve account balance");
    }
    console.log(`Account ${addressFlag} has ${transferTx.balance?.amount} BNB`);
  }

  public async transfer(toAddressFlag: string, amountFlag: string) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferTx;
    try {
      transferTx = await client.account.transfer({
        fromAddress: config.publicKey,
        toAddress: toAddressFlag,
        amount: [
          {
            denom: "BNB",
            amount: amountFlag,
          },
        ],
      });
    } catch (ex) {
      throw new Error("Cannot initialize transferring to payment account");
    }
    let simulateInfo;
    try {
      simulateInfo = await transferTx.simulate({
        denom: "BNB",
      });
    } catch (ex) {
      throw new Error("Unable to obtain gas fees");
    }

    let transactionHash;
    try {
      const broadcastRes = await transferTx.broadcast({
        denom: "BNB",
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: config.publicKey,
        granter: "",
        privateKey: config.privateKey,
      });

      transactionHash = broadcastRes.transactionHash;
    } catch (ex) {
      throw new Error("Unable to broadcast transaction");
    }

    console.log(
      `Successfully transferred ${amountFlag} BNB to ${toAddressFlag}. Transaction ${transactionHash}`
    );
  }
}
