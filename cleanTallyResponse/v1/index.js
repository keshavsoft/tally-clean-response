import changeTypeString from "./changeType/v1/changeTypeString.js";

const showLog = false;

const pullKey = (inCollection) => {
    let collection = inCollection;
    // console.log("collection : ", collection);

    if (!collection || typeof collection !== "object") {
        return { key: undefined, rows: undefined };
    }

    const [key, rows] = Object.entries(collection).find(
        ([key, value]) =>
            !key.startsWith("@") &&
            Array.isArray(value)
    ) ?? [];

    return { key, rows };
};

const cleanTallyResponse = (json) => {
    // console.log("json : ", json);

    const data = json?.ENVELOPE?.BODY?.DATA;
    if (showLog) console.log("data : ", data);

    let collection = data?.COLLECTION;
    if (showLog) console.log("collection1 : ", collection);

    const originalKeys = Object.keys(collection);

    if (originalKeys.length === 1 && !Array.isArray(collection[originalKeys[0]])) {
        collection[originalKeys[0]] = [collection[originalKeys[0]]];
    };

    if (showLog) console.log("originalKeys : ", originalKeys);

    const { key, rows } = pullKey(collection);
    if (showLog) console.log("collection1 : ", key, rows);
    const neededArray = rows;
    // console.log("neededArray : ", neededArray[1]);

    if (!Array.isArray(neededArray)) {
        return neededArray;
    };

    const changedArray = changeTypeString(neededArray);

    if (changedArray?.[1]?.["ALLINVENTORYENTRIES.LIST"]?.[0]?.["BATCHALLOCATIONS.LIST"]) {
        console.log("changedArray=-------- : ", changedArray[1]["ALLINVENTORYENTRIES.LIST"][0]["BATCHALLOCATIONS.LIST"]);
    };

    return changedArray;
};

export default cleanTallyResponse;