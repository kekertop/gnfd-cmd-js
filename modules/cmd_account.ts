import {Client} from "@bnb-chain/greenfield-chain-sdk";

const client = Client.create(
    "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
    "5600"
);

const PUBLIC_KEY = "0x54c4F86eFfcecf4A06E70C262f1b762764ee7265"
const PRIVATE_KEY = "0x9b9ef687e5f9d36f3f411c1a13af0993c01b75c729df2dcb5c75782f7e0e2045"
const DEFAULT_ACCOUNT = "0x22ED18D6c79f91ba186b23f1920Df4a2f2Ca1E3B"

export async function createPaymentAccount() {
    const transferTx = await client.account.createPaymentAccount({
        creator: PUBLIC_KEY
    });
    const simulateInfo = await transferTx.simulate({
        denom: 'BNB',
    });
    console.log("check")
    const broadcastRes = await transferTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: PUBLIC_KEY,
        granter: '',
        privateKey: PRIVATE_KEY,
    });
    console.log(broadcastRes.transactionHash)
}


export async function deposit(
    toAddressFlag: string,
    amountFlag: string,
) {
    const transferTx = await client.payment.deposit({
        creator: PUBLIC_KEY,
        to: toAddressFlag,
        amount: amountFlag,
    });
    const simulateInfo = await transferTx.simulate({
        denom: 'BNB',
    });
    const broadcastRes = await transferTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: PUBLIC_KEY,
        granter: '',
        privateKey: PRIVATE_KEY,
    });
}


export async function withdraw(
    fromAddressFlag: string,
    amountFlag: string,
) {
    const transferTx = await client.payment.withdraw({
        creator: PUBLIC_KEY,
        from: fromAddressFlag,
        amount: amountFlag,
    })
    const simulateInfo = await transferTx.simulate({
        denom: 'BNB',
    });
    const broadcastRes = await transferTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: PUBLIC_KEY,
        granter: '',
        privateKey: PRIVATE_KEY,
    });
}


export async function listPaymentAccounts(
    ownerAddressFlag?: string,
) {
    const transferTx = await client.account.getPaymentAccountsByOwner(ownerAddressFlag || DEFAULT_ACCOUNT);
    console.log(transferTx.paymentAccounts)
}

export async function getAccountBalance(
    addressFlag?: string,
) {
    const transferTx = await client.account.getAccountBalance({
        address: addressFlag || DEFAULT_ACCOUNT,
        denom: 'BNB'
    });
    console.log(transferTx.balance?.amount)
}


export async function transfer(
    toAddressFlag: string,
    amountFlag: string,
) {
    const transferTx = await client.account.transfer({
        fromAddress: PUBLIC_KEY,
        toAddress: toAddressFlag,
        amount: [
            {
                denom: 'BNB',
                amount: amountFlag,
            },
        ],
    });
    const simulateInfo = await transferTx.simulate({
        denom: 'BNB',
    });
    const broadcastRes = await transferTx.broadcast({
        denom: 'BNB',
        gasLimit: Number(simulateInfo.gasLimit),
        gasPrice: simulateInfo.gasPrice,
        payer: PUBLIC_KEY,
        granter: '',
        privateKey: PRIVATE_KEY,
    });
}

module.exports = {
    createPaymentAccount,
    deposit,
    withdraw,
    listPaymentAccounts,
    getAccountBalance,
    transfer
}