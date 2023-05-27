import {newClient} from "./client";
import {ConfigService} from "./config";
import {executeTransaction} from "../utils/transactionUtils";


class AccountService {
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

  public async deposit(toAddressFlag: string, amountFlag: string) {
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

  public async withdraw(fromAddressFlag: string, amountFlag: string) {
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

  public async listPaymentAccounts(ownerAddressFlag: string) {
    const client = await newClient();

    let getListPayAccTx;
    try {
      getListPayAccTx = await client.account.getPaymentAccountsByOwner(ownerAddressFlag);
    } catch (ex) {
      throw new Error("Cannot get payments accounts by owner");
    }

    console.log(getListPayAccTx.paymentAccounts);
  }

  public async getAccountBalance(addressFlag: string) {
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

    const response = await executeTransaction(transferTx);

    console.log(
        `Successfully transferred ${amountFlag} BNB to ${toAddressFlag}. Transaction ${response.transactionHash}`
    );
  }
}
