interface cmdCreatePaymentAccountInterface {
    //don't know
    //in go, it was cli.Context
    cliContext: any;
}

interface depositInterface {
    //don't know
    //in go, it was cli.Context
    cliContext: any;
}

interface cmdPaymentDepositInterface {
    toAddressFlag: string;
    amountFlag: string;
}

interface cmdPaymentWithdrawInterface {
    fromAddressFlag: string;
    amountFlag: string;
}

interface withdrawInterface {
    //don't know
    //in go, it was cli.Context
    cliContext: any;
}

interface cmdListPaymentAccountsInterface {
    ownerAddressFlag: string;
}

interface listPaymentAccountsInterface {
    //don't know
    //in go, it was cli.Context
    cliContext: any;
}

interface cmdGetAccountBalanceInterface {
    addressFlag: string;
}

interface getAccountBalanceInterface {
    //don't know
    //in go, it was cli.Context
    cliContext: any;
}

interface cmdTransferInterface {
    toAddressFlag: string;
    amountFlag: string;
}

interface transferInterface {
    //don't know
    //in go, it was cli.Context
    cliContext: any;
}

/* COMMAND LINE COMMANDS BEGIN */
function cmdCreatePaymentAccount() {

}

function createPaymentAccount(params: cmdCreatePaymentAccountInterface) {

}

function cmdPaymentDeposit(params: cmdPaymentDepositInterface) {

}

function deposit(params: depositInterface) {

}

function cmdPaymentWithdraw(params: cmdPaymentWithdrawInterface) {

}

function withdraw(params: withdrawInterface) {

}

function cmdListPaymentAccounts(params: cmdListPaymentAccountsInterface) {

}

function listPaymentAccounts(params: listPaymentAccountsInterface) {

}

function cmdGetAccountBalance(params: cmdGetAccountBalanceInterface) {

}

function getAccountBalance(params: getAccountBalanceInterface) {

}

function cmdTransfer(params: cmdTransferInterface) {

}

function transfer(params: transferInterface) {

}