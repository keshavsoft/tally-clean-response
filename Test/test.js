import assert from "node:assert/strict";
import cleanTallyResponse, { startFunc, cleanTallyResponse as namedClean } from "../src/index.js";

console.log("Running tally-clean-response test suite...\n");

// Test 1: Exports check
assert.equal(typeof cleanTallyResponse, "function", "Default export must be a function");
assert.equal(typeof startFunc, "function", "startFunc export must be a function");
assert.equal(typeof namedClean, "function", "named export must be a function");
console.log("✓ Exports check passed");

// Test 2: Basic unboxing of @_TYPE and #text
const sampleMulti = {
  ENVELOPE: {
    BODY: {
      DATA: {
        COLLECTION: {
          VOUCHER: [
            {
              DATE: { "@_TYPE": "Date", "#text": "20260401" },
              VOUCHERNUMBER: { "@_TYPE": "Number", "#text": 42 },
              VOUCHERTYPENAME: { "@_TYPE": "String", "#text": "Purchase" },
              ISDEEMEDPOSITIVE: { "@_TYPE": "Logical", "#text": "Yes" },
              EMPTYFIELD: { "@_TYPE": "String" },
              "@_REMOTEID": "guid-12345"
            }
          ]
        }
      }
    }
  }
};

const resultMulti = cleanTallyResponse(sampleMulti);
assert.equal(Array.isArray(resultMulti), true, "Result must be an array");
assert.equal(resultMulti.length, 1, "Array length should be 1");
assert.equal(resultMulti[0].DATE, "20260401", "DATE should be unwrapped to string");
assert.equal(resultMulti[0].VOUCHERNUMBER, 42, "VOUCHERNUMBER should be unwrapped to number");
assert.equal(resultMulti[0].VOUCHERTYPENAME, "Purchase", "VOUCHERTYPENAME should be unwrapped to string");
assert.equal(resultMulti[0].ISDEEMEDPOSITIVE, "Yes", "ISDEEMEDPOSITIVE should be unwrapped to string");
assert.equal(resultMulti[0].EMPTYFIELD, "", "Empty node with @_TYPE should unwrap to empty string ''");
assert.equal(resultMulti[0]["@_REMOTEID"], "guid-12345", "Attributes prefixed with @_ should be preserved");
console.log("✓ Basic unboxing & @_TYPE stripping passed");

// Test 3: Single item collection normalized to array
const sampleSingle = {
  ENVELOPE: {
    BODY: {
      DATA: {
        COLLECTION: {
          LEDGER: {
            NAME: { "@_TYPE": "String", "#text": "State Bank of India" },
            CLOSINGBALANCE: { "@_TYPE": "Amount", "#text": 50000.75 }
          }
        }
      }
    }
  }
};

const resultSingle = cleanTallyResponse(sampleSingle);
assert.equal(Array.isArray(resultSingle), true, "Single item collection must be normalized to array");
assert.equal(resultSingle.length, 1, "Single item array length should be 1");
assert.equal(resultSingle[0].NAME, "State Bank of India", "NAME should be unwrapped");
assert.equal(resultSingle[0].CLOSINGBALANCE, 50000.75, "CLOSINGBALANCE should be unwrapped");
console.log("✓ Single item collection normalization passed");

// Test 4: Deeply nested collections (Inventory Entries + Batch Allocations)
const sampleNested = {
  ENVELOPE: {
    BODY: {
      DATA: {
        COLLECTION: {
          VOUCHER: [
            {
              VOUCHERNUMBER: { "@_TYPE": "Number", "#text": 1 },
              "ALLINVENTORYENTRIES.LIST": [
                {
                  STOCKITEMNAME: { "@_TYPE": "String", "#text": "Widget A" },
                  RATE: { "@_TYPE": "Rate", "#text": "100/Nos" },
                  AMOUNT: { "@_TYPE": "Amount", "#text": 1000 },
                  "BATCHALLOCATIONS.LIST": [
                    {
                      BATCHNAME: { "@_TYPE": "String", "#text": "B001" },
                      AMOUNT: { "@_TYPE": "Amount", "#text": 1000 }
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  }
};

const resultNested = cleanTallyResponse(sampleNested);
assert.equal(resultNested[0]["ALLINVENTORYENTRIES.LIST"][0].STOCKITEMNAME, "Widget A");
assert.equal(resultNested[0]["ALLINVENTORYENTRIES.LIST"][0].RATE, "100/Nos");
assert.equal(resultNested[0]["ALLINVENTORYENTRIES.LIST"][0]["BATCHALLOCATIONS.LIST"][0].BATCHNAME, "B001");
console.log("✓ Deep nested array traversal passed");

// Test 5: Safe handling of empty or non-collection input
assert.deepEqual(cleanTallyResponse(null), []);
assert.deepEqual(cleanTallyResponse({}), []);
console.log("✓ Edge cases passed (safe empty array fallback)");

console.log("\nAll tests passed successfully! 🎉");
