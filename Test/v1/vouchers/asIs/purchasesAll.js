import { vouchers } from "../../../../src/index.js";
import { saveOutput } from "../../common/index.js";

const vouchersData = await vouchers.purchases.all("mani9");
saveOutput({ callerFile: import.meta.url, inData: vouchersData });
// console.log("vouchersData", JSON.stringify(vouchersData, null, 2));
// console.log("vouchersData", vouchersData.ENVELOPE.BODY.DATA.COLLECTION.VOUCHER.length);
