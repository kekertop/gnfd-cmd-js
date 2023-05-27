import {createBucket, listBuckets, updateBucket, deleteBucket} from "../modules/bucket";


test("do it", async () => {
    //let response = await createBucket("gnfd://teassst3")
    //let response = await updateBucket("gnfd://teassst3", undefined, 0, "VISIBILITY_TYPE_PUBLIC_READ")
    //let response = await listBuckets()
    let response = await deleteBucket("gnfd://teassst3")
})
