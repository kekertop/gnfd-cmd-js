import {newClient} from "./client";
import {ConfigService} from "./config";
import {executeTransaction} from "../utils/transactionUtils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {option} from "../cli-decorators/option";
import {argument} from "../cli-decorators/argument";

@commandGroup({ prefix: "account", description: "Payment account operations" })
class AccountService {
  @command({ name: "create", description: "Create payment account" })
  public async createPaymentAccount() {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let createPayAccTx;
    try {
      createPayAccTx = await client.account.createPaymentAccount({
        creator: config.publicKey,
      });
    } catch (ex) {
      throw new Error("Unable to create payment account");
    }

    const response = await executeTransaction(createPayAccTx);

    console.log(
        `Successfully created payment account for stream account "${config.publicKey}". Transaction: ${response.transactionHash}`
    );
  }

  @command({ name: "deposit", description: "Deposit to the payment account" })
  public async deposit(
      @option({
        short: "t",
        long: "to-address-flag",
        description: "Address of the payment account to deposit to",
      })
      toAddressFlag: string,
      @option({
        short: "a",
        long: "amount-flag",
        description: "Amount to deposit",
      })
      amountFlag: string
  ) {
    if(!toAddressFlag || !amountFlag) {
      throw new Error("Unable to deposit without address or amount")
    }
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let depositTx;
    try {
      depositTx = await client.payment.deposit({
        creator: config.publicKey,
        to: toAddressFlag,
        amount: amountFlag,
      });
    } catch (ex) {
      throw new Error("Unable to initialize deposit to payment account");
    }

    const response = await executeTransaction(depositTx);

    console.log(
        `Successfully deposited "${amountFlag}" to "${toAddressFlag}" payment account. Transaction: ${response.transactionHash}`
    );
  }

  @command({ name: "withdraw", description: "Withdraw from the payment account" })
  public async withdraw(
      @option({
        short: "f",
        long: "from-address-flag",
        description: "Address of the payment account to withdraw from",
      })
      fromAddressFlag: string,
      @option({
        short: "a",
        long: "amount-flag",
        description: "Amount to withdraw",
      })
      amountFlag: string
  ) {
    if(!fromAddressFlag || !amountFlag) {
      throw new Error("Unable to withdraw without address or amount")
    }
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let withdrawTx;
    try {
      withdrawTx = await client.payment.withdraw({
        creator: config.publicKey,
        from: fromAddressFlag,
        amount: amountFlag,
      });
    } catch (ex) {
      throw new Error("Unable to initialize withdraw from payment account");
    }

    const response = await executeTransaction(withdrawTx);

    console.log(
        `Successfully withdrew "${amountFlag}" from "${fromAddressFlag}" payment account. Transaction: ${response.transactionHash}`
    );
  }

  @command({ name: "list", description: "List existing payment accounts" })
  public async listPaymentAccounts(
      @argument({
        description: "owner address",
        alias: "owner-addr",
      })
      ownerAddressFlag: string
  ) {
    const client = await newClient();

    let getListPayAccTx;
    try {
      getListPayAccTx = await client.account.getPaymentAccountsByOwner(ownerAddressFlag);
    } catch (ex) {
      throw new Error("Cannot get payments accounts by owner");
    }

    console.log(getListPayAccTx.paymentAccounts);
  }

  @command({ name: "getBalance", description: "get balance of an existing payment account" })
  public async getAccountBalance(
      @argument({
        description: "account address",
        alias: "addr",
      })
      addressFlag: string
  ) {
    const client = await newClient();

    let getAccBalTx;
    try {
      getAccBalTx = await client.account.getAccountBalance({
        address: addressFlag,
        denom: "BNB",
      });
    } catch (ex) {
      throw new Error("Unable to retrieve account balance");
    }
    console.log(
        `Account ${addressFlag} has ${getAccBalTx.balance?.amount} BNB`
    );
  }

  @command({ name: "transfer", description: "transfer BNB to an existing payment account" })
  public async transfer(
      @option({
        short: "t",
        long: "to-address-flag",
        description: "Account address to transsfer to",
      })
      toAddressFlag: string,
      @option({
        short: "a",
        long: "amount-flag",
        description: "Amount to send",
      })
      amountFlag: string
  ) {
    if(!toAddressFlag || !amountFlag) {
      throw new Error("Unable to transfer without address or amount")
    }
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

    const response = await executeTransaction(transferTx);

    console.log(
        `Successfully transferred ${amountFlag} BNB to ${toAddressFlag}. Transaction ${response.transactionHash}`
    );
  }
}
