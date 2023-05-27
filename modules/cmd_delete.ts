import { ConfigService } from "../utils/config";
import { newClient } from "./client";
interface IDeleteObjectProps {
  bucketName: string;
  objectName: string;
  operator: string;
}
interface IDeleteGroupProps {
  groupName: string;
  operator: string;
}
async function deleteObject({
  bucketName,
  objectName,
  operator,
}: IDeleteObjectProps) {
  const client = await newClient();
  const config = await ConfigService.getInstance().getConfig();

  const tx = await client.object.deleteObject({
    bucketName,
    objectName,
    operator,
  });
  let simulateDeleteObject;
  try {
    simulateDeleteObject = await tx.simulate({
      denom: "BNB",
    });
  } catch (ex) {
    throw new Error("Unable to obtain gas info");
  }

  let transactionHash;
  try {
    const broadcastData = await tx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateDeleteObject.gasLimit),
      gasPrice: simulateDeleteObject.gasPrice,
      payer: config.publicKey,
      granter: "",
      privateKey: config.privateKey,
    });

    transactionHash = broadcastData.transactionHash;
  } catch (ex) {
    throw new Error("Unable to broadcast transaction");
  }
}

async function deleteGroup({ groupName, operator }: IDeleteGroupProps) {
  const client = await newClient();
  const config = await ConfigService.getInstance().getConfig();

  const tx = await client.group.deleteGroup({
    groupName,
    operator,
  });
  let simulateDeleteGroup;
  try {
    simulateDeleteGroup = await tx.simulate({
      denom: "BNB",
    });
  } catch (ex) {
    throw new Error("Unable to obtain gas info");
  }

  let transactionHash;
  try {
    const broadcastData = await tx.broadcast({
      denom: "BNB",
      gasLimit: Number(simulateDeleteGroup.gasLimit),
      gasPrice: simulateDeleteGroup.gasPrice,
      payer: config.publicKey,
      granter: "",
      privateKey: config.privateKey,
    });

    transactionHash = broadcastData.transactionHash;
  } catch (ex) {
    throw new Error("Unable to broadcast transaction");
  }
}
