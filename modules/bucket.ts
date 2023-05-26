interface CreateBucketOptions {
    bucketUrl: string;
    primarySPFlag?: string;
    paymentFlag?: string;
    chargeQuotaFlag?: number;
    visibilityFlag?: any;
}

interface UpdateBucketOptions {
    bucketUrl: string;
    paymentFlag?: string;
    chargeQuotaFlag?: number;
    visibilityFlag?: any;
}

interface PutBucketPolicyOptions {
    bucketUrl: string;
    groupIDFlag?: number;
    granteeFlag?: string;
    actionsFlag?: string;
    effectFlag?: any;
    expireTimeFlag?: number;
}


// createBucket send the create bucket request to storage provider
function createBucket(params: CreateBucketOptions) {

}

// updateBucket send the create bucket request to storage provider
function updateBucket(params: UpdateBucketOptions) {

}

// listBuckets list the buckets of the specific owner
function listBuckets() {

}

function putBucketPolicy(params: PutBucketPolicyOptions) {

}

module.exports = {
    createBucket: createBucket,
    updateBucket: updateBucket,
    listBuckets: listBuckets,
    putBucketPolicy: putBucketPolicy
}