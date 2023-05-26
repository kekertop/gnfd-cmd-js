interface PutObjectOptions {
    filePath: string; //ArgsUsage: "[filePath] OBJECT-URL"
    secondarySPFlag?: string;
    contentTypeFlag?: string;
    visibilityFlag?: any;
    folderFlag?: string;
}

interface CreateFolderOptions {
    objectUrl: string;
    visibilityFlag?: any;
    objectPrefix?: string;
}

interface GetObjOptions {
    filePath: string; //ArgsUsage: "[filePath] OBJECT-URL"
    startOffsetFlag: number;
    endOffsetFlag: number;
}

interface PutObjectPolicyOptions {
    objectUrl: string; //ArgsUsage: "[filePath] OBJECT-URL"
    groupIDFlag?: number;
    granteeFlag?: string;
    actionsFlag?: any;
    effectFlag?: string;
    expireTimeFlag?: number;
}

interface UpdateObjectOptions {
    objectUrl: string;
    visibilityFlag?: any;
}

interface CancelCreateObjectOptions {
    objectUrl: string;
}

interface ListObjectsOptions {
    bucketUrl: string;
}

interface UploadInfoOptions {
    objectUrl: string;
}

interface PathExistsOptions {
    path: string;
}

interface GetObjAndBucketNamesOptions {
    urlInfo: string;
}

function putObject(params: PutObjectOptions) {

}

function putObjectPolicy(params: PutObjectPolicyOptions) {

}

function getObject(params: GetObjOptions) {

}

function cancelCreateObject(params: CancelCreateObjectOptions) {

}

function listObjects(params: ListObjectsOptions) {

}

function createFolder(params: CreateFolderOptions) {

}

function updateObject(params: UpdateObjectOptions) {

}

function getUploadInfo(params: UploadInfoOptions) {

}

function pathExists(params: PathExistsOptions) {

}

function getObjAndBucketNames(params: GetObjAndBucketNamesOptions) {

}