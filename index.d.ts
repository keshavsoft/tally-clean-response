/**
 * tally-clean-response
 * Simple, clean TDL and XML extraction and manipulation tools for Tally.
 *
 * Copyright (c) 2026 KeshavSoft (MIT License)
 */

/**
 * Cleans and normalizes JSON parsed from Tally ERP 9 / TallyPrime XML responses.
 *
 * - Extracts collection rows from `ENVELOPE.BODY.DATA.COLLECTION`.
 * - Ensures collections are returned as arrays, even when Tally returns a single object.
 * - Recursively strips `@_TYPE` metadata attributes (`String`, `Date`, `Number`, `Logical`, `Rate`, `Amount`, etc.).
 * - Unboxes `#text` node values and normalizes empty tags without content to empty strings `""`.
 * - Deeply traverses nested list collections (e.g. inventory allocations, ledger entries, batch allocations).
 *
 * @param json - Raw JSON response parsed from Tally XML (e.g., via `fast-xml-parser` or `tally-to-xml-tdl`).
 * @returns Array of cleaned row objects, or the original data if not a collection structure.
 */
export function cleanTallyResponse<T = Record<string, any>>(json: any): T[];

/**
 * Named alias for the main cleaner function.
 */
export const startFunc: typeof cleanTallyResponse;

/**
 * Default export function.
 */
export default cleanTallyResponse;
