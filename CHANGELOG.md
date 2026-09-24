# CHANGELOG

All notable changes to `tally-clean-response` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.1] - 2026-09-24

### Fixed
- Fixed module export in `src/index.js` to ensure both default export (`cleanTallyResponse`) and named exports (`cleanTallyResponse`, `startFunc`) resolve properly in ES module environments.
- Corrected named exports across `src/v1/index.js` and `src/v2/index.js`.

### Added
- Added full TypeScript declaration file (`index.d.ts`) supporting generic row typing.
- Added subpath exports for `./v1` and `./v2` in `package.json`.
- Comprehensive documentation: new `README.md`, architectural overview (`docs/ARCHITECTURE.md`), and practical usage examples (`docs/EXAMPLES.md`).

---

## [1.1.0] - 2026-09-20

### Added
- Introduced `v2` engine architecture with optimized recursive dispatcher pattern:
  - `traverse`: Central node dispatcher separating primitives, typed wrappers, arrays, and objects.
  - `alterLeaf`: Automatic scalar normalization for strings, dates, numbers, amounts, logical flags, and rates.
  - `guards`: Type guard utilities (`isNullOrUndefined`, `isArray`, `isObject`, `isTallyType`).
- Normalization of empty XML tags `<TAG TYPE="..."/>` without text nodes to empty strings (`""`).
- Automatic array normalization for single-element collections returned by Tally.

---

## [1.0.0] - 2026-04-18

### Added
- Initial release of `tally-clean-response`.
- Automated extraction and cleaning of Tally XML collection responses (`ENVELOPE.BODY.DATA.COLLECTION`).
- Recursive stripping of `@_TYPE` and unboxing of `#text` values.