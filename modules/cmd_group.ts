interface cmdCreateGroupInterface {
    initMemberFlag: string;
}

interface cmdUpdateGroupInterface {
    addMemberFlag: string;
    removeMemberFlag: string;
    groupOwnerFlag: string;
}

interface createGroupInterface {
    cliContext: any;
}

interface updateGroupMemberInterface {
    cliContext: any;
}

interface getGroupOwnerInterface {
    cliContext: any;
    client: any;
}

function cmdCreateGroup(params: cmdCreateGroupInterface) {

}

function cmdUpdateGroup(params: cmdUpdateGroupInterface) {

}

function createGroup(params: createGroupInterface) {

}

function updateGroupMember(params: updateGroupMemberInterface) {

}

function getGroupOwner(params: getGroupOwnerInterface) {

}