interface cmdHeadGroupInterface {
    groupOwnerFlag: string;
}

interface cmdHeadGroupMemberInterface {
    groupOwnerFlag: string;
    headMemberFlag: string;
}

interface headObjectInterface {
    cliContext: any;
}

interface headBucketInterface {
    cliContext: any;
}

interface headGroupInterface {
    cliContext: any;
}

interface headGroupMemberInterface {
    cliContext: any;
}


function cmdHeadObj() {

}

function cmdHeadBucket() {

}

function cmdHeadGroup(params: cmdHeadGroupInterface) {

}

function cmdHeadGroupMember(params: cmdHeadGroupMemberInterface) {

}

function headObject(params: headObjectInterface) {

}

function headBucket(params: headBucketInterface) {

}

function headGroup(params: headGroupInterface) {

}

function headGroupMember(params: headGroupMemberInterface) {

}