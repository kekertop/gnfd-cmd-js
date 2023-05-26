interface cmdConfig {
    RpcAddr: string;
    ChaidId: string;
    PasswordFile: string;
    Host: string;
}

interface getVisibilityTypeInterface {
    visibility: string;
}

interface parseChainInfoInterface {
    info: string;
    isBucketInfo: boolean;
}

interface getBucketNameByUrlInterface {
    cliContext: any;
}

interface getGroupNameByUrlInterface {
    cliContext: any;
}

interface parseAddrListInterface {
    addrInfo: string;
}

interface parsePrincipalInterface {
    grantee: string;
    groupId: Number;
}

interface getBucketActionInterface {
    action: string;
}

interface getObjectActionInterface {
    action: string;
}

interface parseActionsInterface {
    cliContext: any;
    isObjectPolicy: boolean;
}

interface getPasswordInterface {
    cliContext: any;
    config: cmdConfig;
}

interface loadKeyInterface {
    file: string;
}

interface parseConfigFileInterface {
    filePath: string;
}

function set() {

}

function _String() {

}

function getVisibilityType(params:getVisibilityTypeInterface) {

}

function toCmdErr() {

}

function genCmdErr() {

}

function parseChainInfo(params: parseChainInfoInterface) {

}

function getBucketNameByUrl(params: getBucketNameByUrlInterface) {

}

function getGroupNameByUrl(params: getGroupNameByUrlInterface) {

}

function parseAddrList(params: parseAddrListInterface) {

}

function parsePrincipal(params: parsePrincipalInterface) {

}

function getBucketAction(params: getBucketActionInterface) {

}

function getObjectAction(params: getObjectActionInterface) {

}

function parseActions(params: parseActionsInterface) {

}

function getPassword(params: getPasswordInterface) {

}

function loadKey(params: loadKeyInterface) {

}

function parseConfigFile(params: parseConfigFileInterface) {

}