import { selectJson } from "select-json-by-json";

import { vouchers } from "../../../../src/index.js";
import cleanTallyResponse from "../../../../cleanTallyResponse/v1/index.js";

import { saveOutput } from "../../common/index.js";
import selectJsonSpec from "./select.json" with { type: "json" };

const vouchersData = await vouchers.purchases.period("mani9", "1-Apr-2026", "6-Apr-2026");
// saveOutput({ callerFile: import.meta.url, inData: vouchersData });
// console.log("vouchersData", JSON.stringify(vouchersData, null, 2));

const newJson = cleanTallyResponse(vouchersData);

const selectedData = selectJson(newJson, selectJsonSpec);
saveOutput({ callerFile: import.meta.url, inData: selectedData });

console.log("vouchersData", newJson[0]);
