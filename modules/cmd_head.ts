function headObject(
    objectUrl: string,
) {

}

function headBucket(
    bucketUrl: string,
) {

}

function headGroup(
    groupUrl: string,
    groupOwnerFlag?: string,
) {

}

function headGroupMember(
    groupUrl: string,
    groupOwnerFlag?: string,
    headMemberFlag?: string,
    ) {

}

module.exports = {
    headObject: headObject,
    headBucket: headBucket,
    headGroup: headGroup,
    headGroupMember: headGroupMember,
}