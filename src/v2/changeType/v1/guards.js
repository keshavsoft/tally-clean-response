export const isNullOrUndefined = ({ inData }) => {
    const localData = inData;
    return localData === null || localData === undefined;
};

export const isArray = ({ inData }) => {
    const localData = inData;
    return Array.isArray(localData);
};

export const isObject = ({ inData }) => {
    const localData = inData;
    return localData !== null && typeof localData === "object" && !Array.isArray(localData);
};

export const isTallyType = ({ inData }) => {
    const localData = inData;
    return isObject({ inData: localData }) && "@_TYPE" in localData;
};

export default {
    isNullOrUndefined,
    isArray,
    isObject,
    isTallyType
};
