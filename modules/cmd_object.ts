interface cmdPutObjInterface {
    secondarySPFlag: string;
    contentTypeFlag: string;
    visibilityFlag: string;
    folderFlag: string;
}

interface cmdCreateFolderInterface {
    visibilityFlag: string;
    objectPrefix: string;
}

interface cmdGetObjInterface {
    startOffsetFlag: Number;
    endOffsetFlag: Number;
}

interface cmdPutObjPolicyInterface {
    groupIDFlag: Number;
    granteeFlag: string;
    actionsFlag: string;
    effectFlag: string;
    expireTimeFlag: Number;
}

interface cmdUpdateObjectInterface {
    visibilityFlag: string;
}

interface putObjectInterface{
    cliContext: any;
}

interface putObjectPolicyInterface {
    cliContext: any;
}

interface getObjectInterface {
    cliContext: any;
}

interface cancelCreateObjectInterface {
    cliContext: any;
}

interface listObjectsInterface {
    cliContext: any;
}

interface createFolderInterface {
    cliContext: any;
}

interface updateObjectInterface {
    cliContext: any;
}

interface getUploadInfoInterface {
    cliContext: any;
}

interface pathExistsInterface {
    path: string;
}

interface getObjAndBucketNamesInterface {
    urlInfo: string;
}

function cmdPutObj(params: cmdPutObjInterface) {

}

function cmdGetObj(params: cmdGetObjInterface) {

}

function cmdCreateFolder(params: cmdCreateFolderInterface) {

}

function cmdCancelObjects() {

}

function cmdListObjects() {

}

function cmdPutObjPolicy(params: cmdPutObjPolicyInterface) {

}

function cmdUpdateObject(params: cmdUpdateObjectInterface) {

}

function cmdGetUploadProgress() {

}

function putObject(params: putObjectInterface) {

}

function putObjectPolicy(params: putObjectPolicyInterface) {

}

function getObject(params: getObjectInterface) {

}

function cancelCreateObject(params: cancelCreateObjectInterface) {

}

function listObjects(params: listObjectsInterface) {

}

function createFolder(params: createFolderInterface) {

}

function updateObject(params: updateObjectInterface) {

}

function getUploadInfo(params: getUploadInfoInterface) {

}

function pathExists(params: pathExistsInterface) {

}

function getObjAndBucketNames(params: getObjAndBucketNamesInterface) {

}