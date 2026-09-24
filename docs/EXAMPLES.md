# Examples & Recipes

This guide covers real-world use cases for `tally-clean-response`.

← **[Back to README](../README.md)** &bull; 🌐 **[Live Documentation](https://keshavsoft.github.io/tally-clean-response/)** &bull; 📖 **[Architecture & Internals](ARCHITECTURE.md)**

---

## 1. Purchase & Sales Vouchers with `tally-to-xml-tdl`

```javascript
import { vouchers } from "tally-to-xml-tdl";
import cleanTallyResponse from "tally-clean-response";

async function getPurchases() {
  // 1. Fetch raw data for a specific period
  const rawData = await vouchers.purchases.period(
    "MyCompany",
    "1-Apr-2026",
    "30-Apr-2026"
  );

  // 2. Clean the response
  const purchaseVouchers = cleanTallyResponse(rawData);

  for (const vch of purchaseVouchers) {
    console.log(`Voucher #${vch.VOUCHERNUMBER} on ${vch.DATE}: ${vch.VOUCHERTYPENAME}`);
    
    // Nested inventory entries are also cleanly unwrapped
    if (Array.isArray(vch["ALLINVENTORYENTRIES.LIST"])) {
      for (const item of vch["ALLINVENTORYENTRIES.LIST"]) {
        console.log(`  - Item: ${item.STOCKITEMNAME}, Rate: ${item.RATE}, Amount: ${item.AMOUNT}`);
      }
    }
  }
}

getPurchases();
```

---

## 2. Master Records (Ledgers, Stock Items, UOM)

```javascript
import { masters } from "tally-to-xml-tdl";
import cleanTallyResponse from "tally-clean-response";

async function getMasters() {
  // Fetch units of measure
  const rawUom = await masters.get("MyCompany", "uom");
  const uoms = cleanTallyResponse(rawUom);
  console.log("Units of Measure:", uoms);

  // Fetch stock items
  const rawStock = await masters.get("MyCompany", "stockItems");
  const stockItems = cleanTallyResponse(rawStock);
  console.log("Stock Items:", stockItems);
}

getMasters();
```

---

## 3. Direct XML to JSON Pipeline with `fast-xml-parser`

If you are querying Tally directly via HTTP POST and receiving raw XML strings:

```javascript
import http from "node:http";
import { XMLParser } from "fast-xml-parser";
import cleanTallyResponse from "tally-clean-response";

async function queryTally(xmlRequest) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      "http://localhost:9000",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/xml;charset=utf-8",
          "Content-Length": Buffer.byteLength(xmlRequest)
        }
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );

    req.on("error", reject);
    req.write(xmlRequest);
    req.end();
  });
}

async function run() {
  const xmlQuery = `
    <ENVELOPE>
      <HEADER>
        <TALLYREQUEST>Export Data</TALLYREQUEST>
      </HEADER>
      <BODY>
        <EXPORTDATA>
          <REQUESTDESC>
            <REPORTNAME>Voucher Register</REPORTNAME>
          </REQUESTDESC>
        </EXPORTDATA>
      </BODY>
    </ENVELOPE>
  `;

  const rawXml = await queryTally(xmlQuery);

  // Parse XML using standard attributes
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text"
  });

  const rawJson = parser.parse(rawXml);

  // Clean into plain JS objects
  const cleanData = cleanTallyResponse(rawJson);
  console.log(cleanData);
}
```

---

## 4. Serving Clean Tally Data via Express REST API

```javascript
import express from "express";
import { vouchers } from "tally-to-xml-tdl";
import cleanTallyResponse from "tally-clean-response";

const app = express();

app.get("/api/vouchers/purchases", async (req, res) => {
  try {
    const { company = "MyCompany", fromDate, toDate } = req.query;
    const rawData = await vouchers.purchases.period(company, fromDate, toDate);
    const cleaned = cleanTallyResponse(rawData);

    res.json({
      status: "success",
      count: cleaned.length,
      data: cleaned
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```

---

## 5. TypeScript Usage with Strong Typing

```typescript
import cleanTallyResponse from "tally-clean-response";

interface InventoryEntry {
  STOCKITEMNAME: string;
  RATE: string;
  AMOUNT: number;
  ACTUALQTY: string;
}

interface Voucher {
  DATE: string;
  GUID: string;
  VOUCHERTYPENAME: string;
  VOUCHERNUMBER: number;
  "ALLINVENTORYENTRIES.LIST"?: InventoryEntry[];
  "@_REMOTEID"?: string;
  "@_VCHKEY"?: string;
}

const rawResponse: any = await fetchVouchersFromTally();

// Strongly typed array
const vouchersList: Voucher[] = cleanTallyResponse<Voucher>(rawResponse);

vouchersList.forEach((vch) => {
  console.log(vch.VOUCHERNUMBER, vch.VOUCHERTYPENAME);
});
```
