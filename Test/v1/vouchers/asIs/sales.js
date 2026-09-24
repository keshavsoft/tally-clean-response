import { vouchers } from "../../../../src/index.js";
import { saveOutput } from "../../common/index.js";

const vouchersData = await vouchers.sales.get("mani9", "1-Apr-2026", "1-Apr-2026", "period");
saveOutput({ callerFile: import.meta.url, inData: vouchersData });
console.log("vouchersData", vouchersData.length);
