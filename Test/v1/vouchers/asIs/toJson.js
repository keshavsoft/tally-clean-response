import { vouchers } from "tally-to-xml-tdl";
import cleanTallyResponse from "../../../../src/index.js";

import { saveOutput } from "../../common/index.js";

const vouchersData = await vouchers.purchases.period("mani9", "1-Apr-2026", "6-Apr-2026");
// saveOutput({ callerFile: import.meta.url, inData: vouchersData });
// console.log("vouchersData", JSON.stringify(vouchersData, null, 2));

const newJson = cleanTallyResponse(vouchersData);

saveOutput({ callerFile: import.meta.url, inData: newJson });

console.log("vouchersData", newJson[0]);
