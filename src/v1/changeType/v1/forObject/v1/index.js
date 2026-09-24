import traverse from "../../traverse.js";

const startFunc = ({ inDataAsObject }) => {
    const localDataAsObject = inDataAsObject;

    if (localDataAsObject === null || typeof localDataAsObject !== "object") {
        return localDataAsObject;
    }

    const result = {};

    for (const [key, value] of Object.entries(localDataAsObject)) {
        result[key] = traverse({ inData: value });
    }

    return result;
};

export default startFunc;
