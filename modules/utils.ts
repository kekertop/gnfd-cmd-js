import * as url from "url";

function getPassword(
    config: string,
    passwordFileFlag?: string,
) {

}

export function getBucketNameByUrl (
    urlInfo: string,
) : string {
    if (urlInfo.includes("gnfd://")) {
        urlInfo = urlInfo.slice("gnfd://".length);
    }
    const splits = urlInfo.split("/", 1);
    return splits[0];
}

function getGroupNameByUrl(
    urlInfo: string,
) {

}

function parseActions(
    actionsFlag?: string,
    isObjectPolicy?: boolean,
) {

}

module.exports = {
    getPassword: getPassword,
    getBucketNameByUrl: getBucketNameByUrl,
    getGroupNameByUrl: getGroupNameByUrl,
    parseActions: parseActions,
}