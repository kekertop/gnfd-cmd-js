interface depositInterface {
    cliContext: any;
}

interface depositOptions {
    toAddressFlag?: string;
    amountFlag?: string;
}

interface WithdrawOptions {
    fromAddressFlag?: string;
    amountFlag?: string;
}

interface ListPaymentAccountsOptions {
    ownerAddr: string;
    ownerAddressFlag?: string;
}

interface GetAccountBalanceOptions {
    addressFlag?: string;
}

interface TransferOptions {
    toAddressFlag?: string;
    amountFlag?: string;
}



function createPaymentAccount() {

}


function deposit(params: depositOptions) {

}


function withdraw(params: WithdrawOptions) {

}


function listPaymentAccounts(params: ListPaymentAccountsOptions) {

}

function getAccountBalance(params: GetAccountBalanceOptions) {

}


function transfer(params: TransferOptions) {

}