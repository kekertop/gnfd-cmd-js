import { ConfigService } from "./config";
import { newClient } from "./client";
import { executeTransaction } from "../utils/transactionUtils";



class DeleteService {
  public async deleteObject(
      bucketName: string,
      objectName: string,
      operator: string,
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();

    let deleteObjTx
    try {
      deleteObjTx = await client.object.deleteObject({
        bucketName,
        objectName,
        operator,
      });
    } catch (ex) {
      throw new Error("Unable to initialize deleting object")
    }

    const response = await executeTransaction(deleteObjTx);
    console.log(
        `Successfully deleted payment account "${objectName}" at bucket ${bucketName}. Transaction: ${response.transactionHash}`
    );
  }

  public async deleteGroup(
      groupName: string,
      operator: string,
  ) {
    const client = await newClient();
    const config = await ConfigService.getInstance().getConfig();


    let deleteGroupTx
    try {
      deleteGroupTx = await client.group.deleteGroup({
        groupName,
        operator,
      });
    } catch(ex) {
      throw new Error("Unable to initialize group deletion")
    }

    const response = await executeTransaction(deleteGroupTx);
    console.log(
        `Successfully deleted group "${deleteGroupTx}". Transaction: ${response.transactionHash}`
    );
  }
}
