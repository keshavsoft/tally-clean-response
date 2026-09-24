/**
 * Unwraps Tally XML typed objects and normalizes them into clean scalars.
 *
 * Removes @_TYPE (String, Date, Number, Logical, Rate, etc.) and extracts #text.
 * Empty tags (<TAG TYPE="..."/>) without #text normalize to empty string "".
 *
 * @param {object} params
 * @param {object} params.inValue - Typed object containing @_TYPE.
 * @returns {*} Clean scalar value.
 */
const alterLeaf = ({ inValue }) => {
    const localValue = inValue;

    if (!localValue || typeof localValue !== "object") {
        return localValue;
    }

    if ("@_TYPE" in localValue) {
        const type = String(localValue["@_TYPE"] || "").toLowerCase();
        const hasText = "#text" in localValue;
        const rawText = localValue["#text"];

        if (!hasText || rawText === undefined || rawText === null) {
            return "";
        }

        switch (type) {
            case "string":
            case "date":
            case "logical":
            case "rate":
                return String(rawText);
            case "number":
            case "amount":
            case "quantity":
                return rawText;
            default:
                return rawText;
        }
    }

    return localValue;
};

export default alterLeaf;
