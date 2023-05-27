import * as url from "url";

export function parseBucketAndObject(urlPath: string): [string, string] | null {
    if (urlPath.includes("gnfd://")) {
        urlPath = urlPath.replace("gnfd://", "");
    }

    const index = urlPath.indexOf("/");
    if (index <= -1) {
        return null;
    }

    const bucketName = urlPath.substring(0, index);
    const objectName = urlPath.substring(index + 1);

    return [bucketName, objectName];
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

export function getGroupNameByUrl(
    urlInfo: string,
) : string {
    if (urlInfo.includes("gnfd://")) {
        urlInfo = urlInfo.slice("gnfd://".length);
    }
    const splits = urlInfo.split("/", 1);
    return splits[0];
}