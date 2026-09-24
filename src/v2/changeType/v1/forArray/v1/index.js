import traverse from "../../traverse.js";

const startFunc = ({ inDataAsArray }) => {
    const localDataAsArray = inDataAsArray;

    if (!Array.isArray(localDataAsArray)) {
        return [];
    }

    const childrenArray = localDataAsArray.map(element => {
        return traverse({ inData: element });
    });

    return childrenArray;
};

export default startFunc;
