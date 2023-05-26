interface CreateGroupOptions {
    groupUrl: string;
    initMemberFlag?: string;
}

interface UpdateGroupOptions {
    groupUrl: string,
    addMemberFlag?: string;
    removeMemberFlag?: string;
    groupOwnerFlag?: string;
}

interface UpdateGroupMemberOptions {
    addMemberFlag?: string;
    removeMemberFlag?: string;
}

interface GroupOwnerOptions {
    client: any; //what is that??!?!?
    groupOwnerFlag?: string;
}

function createGroup(params: CreateGroupOptions) {

}

//seems like it is not fully finished
function updateGroup(params: UpdateGroupOptions) {

}
function updateGroupMember(params: UpdateGroupMemberOptions) {

}

function getGroupOwner(params: GroupOwnerOptions) {

}