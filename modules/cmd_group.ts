// createBucket send the create bucket request to storage provider
import { getBucketNameByUrl } from "./utils";
import { Client } from "@bnb-chain/greenfield-chain-sdk";
import { VisibilityType } from "@bnb-chain/greenfield-cosmos-types/greenfield/storage/common";

const client = Client.create(
  "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org",
  "5600"
);
interface ICreateGroupProps {
  creator: string;
  groupName: string;
  members: string[];
}
interface IUpdateGroupProps {
  groupName: string;
  groupOwner: string;
  membersToAdd: string[];
  membersToDelete: string[];
  operator: string;
}
async function createGroup({ creator, groupName, members }: ICreateGroupProps) {
  const tx = await client.group.createGroup({
    creator,
    groupName,
    members,
  });
  const simData = await tx.simulate({ denom: "BNB" });
  const broadcastData = await tx.broadcast({
    denom: "BNB",
    gasLimit: Number(simData.gasLimit),
    gasPrice: simData.gasPrice,
    payer: "0x22A5147a9EbB814DCE7A4A73494E5C45697856A0",
    granter: "",
    privateKey:
      "0xddda9639071a678b245da91d11aa072b76a7d3ea7ff96edb3c82e6ee19518253",
  });
  console.log(broadcastData);
}
createGroup({
  creator: "0x22A5147a9EbB814DCE7A4A73494E5C45697856A0",
  groupName: "hhyhyhy",
  members: ["0x54c4F86eFfcecf4A06E70C262f1b762764ee7265"],
});
//seems like it is not fully finished

async function updateGroupMember({
  groupName,
  groupOwner,
  membersToAdd,
  membersToDelete,
  operator,
}: IUpdateGroupProps) {
  const tx = await client.group.updateGroupMember({
    groupName,
    groupOwner,
    membersToAdd,
    membersToDelete,
    operator,
  });
  const simData = await tx.simulate({ denom: "BNB" });
  const broadcastData = await tx.broadcast({
    denom: "BNB",
    gasLimit: Number(simData.gasLimit),
    gasPrice: simData.gasPrice,
    payer: "0x22A5147a9EbB814DCE7A4A73494E5C45697856A0",
    granter: "",
    privateKey:
      "0xddda9639071a678b245da91d11aa072b76a7d3ea7ff96edb3c82e6ee19518253",
  });
}

function getGroupOwner() {
  //unreal
}
//   client: any, //what is that??!?!?   (ctx *cli.Context, client client.Client)
//   groupOwnerFlag?: string

module.exports = {
  createGroup: createGroup,
  updateGroupMember: updateGroupMember,
  getGroupOwner: getGroupOwner,
};
