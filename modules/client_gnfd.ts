interface NewClientOptions {
    config?: string;
    rpcAddr?: string;
    chainId?: string;
    keystore?: string;
    host?: string;
}

interface ParseBucketAndObjectOptions {
    urlPath: string;
}

interface ParseBucketOptions {
    urlPath: string;
}

function newClient(params: NewClientOptions){

}

function parseBucketAndObject(params: ParseBucketAndObjectOptions) {

}

function parseBucket(params: ParseBucketOptions) {

}

module.exports = {
    newClient: newClient,
    parseBucketAndObject: parseBucketAndObject,
    parseBucket: parseBucket
}