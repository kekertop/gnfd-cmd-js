function createGroup(
    groupUrl: string,
    initMemberFlag?: string,
) {

}

//seems like it is not fully finished

function updateGroupMember(
    groupUrl: string,
    addMemberFlag?: string,
    removeMemberFlag?: string,
    groupOwnerFlag?: string,
) {

}

function getGroupOwner(
    client: any, //what is that??!?!?   (ctx *cli.Context, client client.Client)
    groupOwnerFlag?: string,
) {

}

module.exports = {
    createGroup: createGroup,
    updateGroupMember: updateGroupMember,
    getGroupOwner: getGroupOwner,
}