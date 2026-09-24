# tally-clean-response

[![npm version](https://img.shields.io/npm/v/tally-clean-response.svg?style=flat-square)](https://www.npmjs.com/package/tally-clean-response)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg?style=flat-square)](#)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg?style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](#)

> Lightweight, zero-dependency utility to clean, sanitize, and normalize JSON responses from Tally ERP 9 / TallyPrime XML-to-JSON parsers into clean, developer-friendly JavaScript objects.

🌐 **[Live Documentation](https://keshavsoft.github.io/tally-clean-response/)** &bull; 📖 **[Architecture Guide](https://keshavsoft.github.io/tally-clean-response/guide.html)** (or [offline markdown](docs/ARCHITECTURE.md)) &bull; 💡 **[Examples & Recipes](docs/EXAMPLES.md)** &bull; 📦 **[npm package](https://www.npmjs.com/package/tally-clean-response)**

---

## Overview

When querying Tally via XML/TDL (using libraries like [`tally-to-xml-tdl`](https://www.npmjs.com/package/tally-to-xml-tdl) or [`fast-xml-parser`](https://www.npmjs.com/package/fast-xml-parser)), the parsed JSON contains heavy XML serialization artifacts:
- **Typed wrappers**: Scalar values wrapped in type metadata objects, e.g. `{"@_TYPE": "String", "#text": "Pur Exp"}` or `{"@_TYPE": "Number", "#text": 1}`.
- **Empty tag noise**: Empty XML nodes like `<ALLINVENTORYENTRIES.LIST TYPE="String"/>` converted into `{ "@_TYPE": "String" }` instead of clean empty values.
- **Deep nesting**: Collection records trapped inside `ENVELOPE.BODY.DATA.COLLECTION.*`.
- **Inconsistent single-item collections**: Tally returns a single object instead of an array when only one item matches.

**`tally-clean-response`** automates this cleanup in a single call, returning a normalized array of pristine JavaScript objects with full recursive unwrapping of all nested inventory and ledger lines.

---

## Comparison: Before vs After

### ❌ Raw Parsed Tally XML Output (Before)

```json
{
  "ENVELOPE": {
    "HEADER": { "TALLYREQUEST": "Export Data" },
    "BODY": {
      "DATA": {
        "COLLECTION": {
          "VOUCHER": [
            {
              "DATE": { "@_TYPE": "Date", "#text": "20260401" },
              "GUID": "56b158ca-11af-4ad5-bc28-c1c2428041b9-0002a874",
              "VOUCHERTYPENAME": { "@_TYPE": "String", "#text": "Pur Exp" },
              "VOUCHERNUMBER": { "@_TYPE": "Number", "#text": 1 },
              "ISDEEMEDPOSITIVE": { "@_TYPE": "Logical", "#text": "No" },
              "ALLINVENTORYENTRIES.LIST": { "@_TYPE": "String" },
              "@_REMOTEID": "56b158ca-11af-4ad5-bc28-c1c2428041b9-0002a874",
              "@_VCHKEY": "56b158ca-11af-4ad5-bc28-c1c2428041b9-0000b420:000000a8"
            }
          ]
        }
      }
    }
  }
}
```

### ✅ Cleaned Response (After `cleanTallyResponse`)

```json
[
  {
    "DATE": "20260401",
    "GUID": "56b158ca-11af-4ad5-bc28-c1c2428041b9-0002a874",
    "VOUCHERTYPENAME": "Pur Exp",
    "VOUCHERNUMBER": 1,
    "ISDEEMEDPOSITIVE": "No",
    "ALLINVENTORYENTRIES.LIST": "",
    "@_REMOTEID": "56b158ca-11af-4ad5-bc28-c1c2428041b9-0002a874",
    "@_VCHKEY": "56b158ca-11af-4ad5-bc28-c1c2428041b9-0000b420:000000a8"
  }
]
```

---

## Key Features

- **Zero Runtime Dependencies**: Ultra-lightweight and fast, no bloat.
- **Deep Recursive Traversal**: Cleans nested lists arbitrarily deep (`ALLINVENTORYENTRIES.LIST`, `BATCHALLOCATIONS.LIST`, `LEDGERENTRIES.LIST`, etc.).
- **Automatic Unboxing**: Extracts `#text` values from typed leaf objects (`String`, `Date`, `Number`, `Logical`, `Rate`, `Amount`, etc.).
- **Tag Normalization**: Unwraps empty typed nodes `<TAG TYPE="..."/>` to clean `""` empty strings.
- **Collection Array Guarantee**: Guarantees an array output even if Tally returns a single object.
- **Preserves Metadata Identifiers**: Retains essential Tally attributes (e.g. `@_REMOTEID`, `@_VCHKEY`, `@_VCHTYPE`).
- **ESM & TypeScript Native**: Full ESM support with bundled TypeScript declarations (`index.d.ts`).

---

## Installation

```bash
npm install tally-clean-response
```

Or using `pnpm` / `yarn`:

```bash
pnpm add tally-clean-response
# or
yarn add tally-clean-response
```

---

## Quick Start

### 1. Integration with `tally-to-xml-tdl`

```javascript
import { vouchers } from "tally-to-xml-tdl";
import cleanTallyResponse from "tally-clean-response";

// 1. Fetch raw response from Tally
const rawData = await vouchers.purchases.period("MyCompany", "1-Apr-2026", "6-Apr-2026");

// 2. Clean the response
const cleanedVouchers = cleanTallyResponse(rawData);

console.log(`Fetched ${cleanedVouchers.length} vouchers:`);
console.log(cleanedVouchers[0]);
```

### 2. Usage with `fast-xml-parser`

```javascript
import { XMLParser } from "fast-xml-parser";
import cleanTallyResponse from "tally-clean-response";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text"
});

const rawJson = parser.parse(tallyXmlString);
const records = cleanTallyResponse(rawJson);
```

---

## Import Options

You can import either the **default export** or **named export**:

```javascript
// Default import
import cleanTallyResponse from "tally-clean-response";

// Named import
import { cleanTallyResponse } from "tally-clean-response";

// Internal alias
import { startFunc } from "tally-clean-response";

// Subpath imports (if targeting a specific engine version)
import cleanTallyResponseV2 from "tally-clean-response/v2";
import cleanTallyResponseV1 from "tally-clean-response/v1";
```

---

## Type Conversion Matrix

When unwrapping leaf nodes with `@_TYPE`:

| Tally `@_TYPE` Attribute | Sample Raw Input | Cleaned Output | Normalized Type |
|---|---|---|---|
| `String` | `{"@_TYPE": "String", "#text": "Sales"}` | `"Sales"` | `string` |
| `Date` | `{"@_TYPE": "Date", "#text": "20260401"}` | `"20260401"` | `string` |
| `Logical` | `{"@_TYPE": "Logical", "#text": "Yes"}` | `"Yes"` | `string` |
| `Rate` | `{"@_TYPE": "Rate", "#text": "500/Nos"}` | `"500/Nos"` | `string` |
| `Number` | `{"@_TYPE": "Number", "#text": 125}` | `125` | `number` |
| `Amount` | `{"@_TYPE": "Amount", "#text": 15000.5}` | `15000.5` | `number` / `string` |
| `Quantity` | `{"@_TYPE": "Quantity", "#text": 10}` | `10` | `number` / `string` |
| *Empty tag* | `{"@_TYPE": "String"}` (no `#text`) | `""` | `string` |

Attributes prefixed with `@_` (such as `@_REMOTEID`, `@_VCHKEY`, `@_VCHTYPE`) that are attached directly to objects are preserved intact.

---

## TypeScript Support

Full TypeScript definitions are included out-of-the-box. You can pass a generic type to `cleanTallyResponse<T>` for strong type safety:

```typescript
import cleanTallyResponse from "tally-clean-response";

interface VoucherRow {
  DATE: string;
  GUID: string;
  VOUCHERTYPENAME: string;
  VOUCHERNUMBER: number;
  [key: string]: any;
}

const cleaned = cleanTallyResponse<VoucherRow>(tallyRawResponse);
// cleaned has type VoucherRow[]
```

---

## API Reference

### `cleanTallyResponse(json)`

```typescript
function cleanTallyResponse<T = Record<string, any>>(json: any): T[];
```

#### Parameters

- **`json`** (`object`): The parsed JSON object representing Tally XML output. Typically contains `ENVELOPE.BODY.DATA.COLLECTION`.

#### Return Value

- **`Array<T>`**: An array of cleaned row objects.
- If the collection contains a single record, it is returned inside a single-element array `[record]`.
- If no valid collection array or object is found, it returns the unwrapped rows or fallback data safely.

---

## Project Structure

```
tally-clean-response/
├── src/
│   ├── index.js                     # Root entry point (re-exports v2 default & named)
│   ├── v1/                          # v1 engine implementation
│   │   ├── index.js
│   │   └── changeType/v1/           # Traversal & scalar unwrapping logic
│   └── v2/                          # v2 engine implementation (active)
│       ├── index.js
│       └── changeType/v1/
│           ├── alterLeaf.js         # Normalizes typed leaf nodes
│           ├── changeTypeString.js  # Collection traversal entry
│           ├── guards.js            # Type inspection utilities
│           ├── traverse.js          # Central recursive dispatcher
│           ├── forArray/v1/         # Array element mapping
│           └── forObject/v1/        # Object key/value mapping
├── docs/
│   ├── ARCHITECTURE.md              # Detailed traversal architecture guide
│   └── EXAMPLES.md                  # Comprehensive real-world examples
├── Test/                            # Test fixtures and execution scripts
├── index.d.ts                       # TypeScript declaration file
├── package.json
├── CHANGELOG.md
└── LICENSE
```

---

## Related Projects

- [`tally-to-xml-tdl`](https://www.npmjs.com/package/tally-to-xml-tdl): XML and TDL generator and client for querying Tally ERP 9 / TallyPrime.

---

## License

[MIT](LICENSE) © 2026 [KeshavSoft](https://keshavsoft.com)
