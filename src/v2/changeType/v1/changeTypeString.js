import traverse from "./traverse.js";

/**
 * Traverses an array of Tally collection rows recursively to remove all @_TYPE
 * objects (Date, String, Number, Logical, Rate, etc.) throughout the entire tree.
 *
 * @param {object|Array} input - Either { inArray: Array } or Array directly.
 * @returns {Array} Fully cleaned array of rows.
 */
const changeTypeString = (input) => {
    const localArray = Array.isArray(input) ? input : (input?.inArray ?? input);

    if (!localArray) {
        return [];
    }

    return traverse({ inData: localArray });
};

export default changeTypeString;
export { changeTypeString };
