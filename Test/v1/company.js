import { company } from "../../src/index.js";

const data = await company(false);
console.log("company", JSON.stringify(data, null, 2));
