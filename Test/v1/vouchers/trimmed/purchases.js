import { vouchers } from "../../../../src/index.js";
import { saveOutput } from "../../common/index.js";

const vouchersData = await vouchers.purchases.clean("mani9", "1-Apr-2026", "6-Apr-2026", "purchasesPeriod");
saveOutput({ callerFile: import.meta.url, inData: vouchersData });
console.log("vouchersData", vouchersData.length);
