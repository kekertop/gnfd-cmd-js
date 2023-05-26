/* COMMAND LINE COMMANDS BEGIN */
interface cmdCreateBucketInterface {
    primarySPFlag: string;
    paymentFlag: string;
    chargeQuotaFlag: string;
    visibilityFlag: string;
}

interface cdmUpdateBucketInterface {
    paymentFlag: string;
    chargeQuotaFlag: string;
    visibilityFlag: string;
}

interface cmdPutBucketPolicyInterface {
    groupIDFlag: string;
    granteeFlag: string;
    actionsFlag: string;
    effectFlag: string;
    expireTimeFlag: string;
}

function cmdCreateBucket(params: cmdCreateBucketInterface) {

}

function cdmUpdateBucket(params: cdmUpdateBucketInterface) {

}

function cmdListBuckets() {

}

function cmdPutBucketPolicy(params: cmdPutBucketPolicyInterface) {

}

/* COMMAND LINE COMMANDS END */

// createBucket send the create bucket request to storage provider
function createBucket() {

}

// updateBucket send the create bucket request to storage provider
function updateBucket() {

}

// listBuckets list the buckets of the specific owner
function listBuckets() {

}

function putBucketPolicy() {

}