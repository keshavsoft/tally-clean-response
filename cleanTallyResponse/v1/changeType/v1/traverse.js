import {
    isNullOrUndefined,
    isArray,
    isObject,
    isTallyType
} from "./guards.js";
import forArray from "./forArray/v1/index.js";
import forObject from "./forObject/v1/index.js";
import alterLeaf from "./alterLeaf.js";

/**
 * Central recursive dispatcher adapted from jsonToSpec traversal architecture.
 *
 * Recursively walks JSON trees of arbitrary depth.
 * Leaf nodes containing Tally type wrappers (@_TYPE) are unwrapped and normalized.
 *
 * @param {object} params
 * @param {*} params.inData - Node or subtree to traverse.
 * @returns {*} Cleaned node or subtree.
 */
const traverse = ({ inData }) => {
    const localData = inData;

    if (isNullOrUndefined({ inData: localData })) {
        return localData;
    }

    // Leaf node: Tally typed object with @_TYPE
    if (isTallyType({ inData: localData })) {
        return alterLeaf({ inValue: localData });
    }

    // Branch node: Array
    if (isArray({ inData: localData })) {
        return forArray({ inDataAsArray: localData });
    }

    // Branch node: Object
    if (isObject({ inData: localData })) {
        return forObject({ inDataAsObject: localData });
    }

    // Primitive values (string, number, boolean)
    return localData;
};

export default traverse;
