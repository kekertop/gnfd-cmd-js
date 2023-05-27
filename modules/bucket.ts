// createBucket send the create bucket request to storage provider
function createBucket(
    bucketUrl: string,
    primarySPFlag?: string,
    paymentFlag?: string,
    chargeQuotaFlag?: number,
    visibilityFlag?: any
){

}

// updateBucket send the create bucket request to storage provider
function updateBucket(
    bucketUrl: string,
    paymentFlag?: string,
    chargeQuotaFlag?: number,
    visibilityFlag?: any,
) {

}

// listBuckets list the buckets of the specific owner
function listBuckets() {

}

function putBucketPolicy(
    bucketUrl: string,
    groupIDFlag?: number,
    granteeFlag?: string,
    actionsFlag?: string,
    effectFlag?: any,
    expireTimeFlag?: number,
) {

}

module.exports = {
    createBucket: createBucket,
    updateBucket: updateBucket,
    listBuckets: listBuckets,
    putBucketPolicy: putBucketPolicy
}