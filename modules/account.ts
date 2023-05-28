import {newClient} from "./client";
import {ConfigService} from "./config";
import {executeTransaction} from "../utils/transactionUtils";
import {commandGroup} from "../cli-decorators/commandGroup";
import {command} from "../cli-decorators/command";
import {option} from "../cli-decorators/option";
import {argument} from "../cli-decorators/argument";
import {InputType} from "../utils/inputType";

@commandGroup({prefix: "account", description: "Payment account operations"})
class AccountService {
  @command({name: "create", description: "Create payment account"})
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

  @command({name: "deposit", description: "Deposit to the payment account"})
  public async deposit(
      @option({
        short: "t",
        long: "to-address",
        description: "Address of the payment account to deposit to",
        optionMandatory: true
      }) toAddress: string,
      @option({
        short: "a",
        long: "amount",
        description: "Amount to deposit",
        type: InputType.NUMBER,
        optionMandatory: true
      }) amount: number
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let depositTx;
    try {
      depositTx = await client.payment.deposit({
        creator: config.publicKey,
        to: toAddress,
        amount: amount.toString(),
      });
    } catch (ex) {
      throw new Error("Unable to initialize deposit to payment account");
    }

    const response = await executeTransaction(depositTx);

    console.log(
        `Successfully deposited "${amount}" to "${toAddress}" payment account. Transaction: ${response.transactionHash}`
    );
  }

  @command({name: "withdraw", description: "Withdraw from the payment account"})
  public async withdraw(
      @option({
        short: "f",
        long: "from-address",
        description: "Address of the payment account to withdraw from",
        optionMandatory: true
      }) fromAddressFlag: string,
      @option({
        short: "a",
        long: "amount",
        description: "Amount to withdraw",
        type: InputType.NUMBER,
        optionMandatory: true
      }) amountFlag: number
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let withdrawTx;
    try {
      withdrawTx = await client.payment.withdraw({
        creator: config.publicKey,
        from: fromAddressFlag,
        amount: amountFlag.toString(),
      });
    } catch (ex) {
      throw new Error("Unable to initialize withdraw from payment account");
    }

    const response = await executeTransaction(withdrawTx);

    console.log(
        `Successfully withdrew "${amountFlag}" from "${fromAddressFlag}" payment account. Transaction: ${response.transactionHash}`
    );
  }

  @command({name: "list", description: "List existing payment accounts"})
  public async listPaymentAccounts(
      @argument({
        description: "Owner address",
        alias: "owner-address",
      }) ownerAddressFlag: string
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

  @command({name: "getBalance", description: "get balance of an existing payment account"})
  public async getAccountBalance(
      @argument({
        description: "Account address",
        alias: "address",
      }) addressFlag: string
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

  @command({name: "transfer", description: "transfer BNB to an existing payment account"})
  public async transfer(
      @option({
        short: "t",
        long: "to-address",
        description: "Account address to transfer to",
        optionMandatory: true
      }) toAddress: string,
      @option({
        short: "a",
        long: "amount",
        description: "Amount to send",
        type: InputType.NUMBER,
        optionMandatory: true
      }) amount: number
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let transferTx;
    try {
      transferTx = await client.account.transfer({
        fromAddress: config.publicKey,
        toAddress: toAddress,
        amount: [
          {
            denom: "BNB",
            amount: amount.toString(),
          },
        ],
      });
    } catch (ex) {
      throw new Error("Cannot initialize transferring to payment account");
    }

    const response = await executeTransaction(transferTx);

    console.log(
        `Successfully transferred ${amount} BNB to ${toAddress}. Transaction ${response.transactionHash}`
    );
  }
}
