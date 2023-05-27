function putObject(
    filePath: string, //ArgsUsage: "[filePath] OBJECT-URL"
    secondarySPFlag?: string,
    contentTypeFlag?: string,
    visibilityFlag?: any,
    folderFlag?: string,
) {

}

function putObjectPolicy(
    objectUrl: string, //ArgsUsage: "[filePath] OBJECT-URL"
    groupIDFlag?: number,
    granteeFlag?: string,
    actionsFlag?: any,
    effectFlag?: string,
    expireTimeFlag?: number,
) {

}

function getObject(
    filePath: string, //ArgsUsage: "[filePath] OBJECT-URL"
    startOffsetFlag?: number,
    endOffsetFlag?: number,
) {

}

function cancelCreateObject(
    objectUrl: string,
) {

}

function listObjects(
    bucketUrl: string,
) {

}

function createFolder(
    objectUrl: string,
    visibilityFlag?: any,
    objectPrefix?: string,
) {

}

function updateObject(
    objectUrl: string,
    visibilityFlag?: any,
) {

}

function getUploadInfo(
    objectUrl: string,
) {

}

module.exports = {
    putObject: putObject,
    putObjectPolicy: putObjectPolicy,
    getObject: getObject,
    cancelCreateObject: cancelCreateObject,
    listObjects: listObjects,
    createFolder: createFolder,
    updateObject: updateObject,
    getUploadInfo: getUploadInfo,
}