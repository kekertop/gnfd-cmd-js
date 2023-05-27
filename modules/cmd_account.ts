function createPaymentAccount() {

}


function deposit(
    toAddressFlag?: string,
    amountFlag?: string,
) {

}


function withdraw(
    fromAddressFlag?: string,
    amountFlag?: string,
) {

}


function listPaymentAccounts(
    ownerAddr: string,
    ownerAddressFlag?: string,
) {

}

function getAccountBalance(
    addressFlag?: string,
) {

}


function transfer(
    toAddressFlag?: string,
    amountFlag?: string,
) {

}

module.exports = {
    createPaymentAccount: createPaymentAccount,
    deposit: deposit,
    withdraw: withdraw,
    listPaymentAccounts: listPaymentAccounts,
    getAccountBalance: getAccountBalance,
    transfer: transfer,
}