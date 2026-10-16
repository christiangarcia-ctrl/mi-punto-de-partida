# Browser acceptance checks

Install Playwright in a separate test runtime (`npm install playwright`) and set `NODE_PATH` to its node_modules folder. Set `CHROME_EXECUTABLE` to an installed Chrome/Chromium binary, or install Playwright Chromium.

The test uses synthetic data, blocks external HTTPS, and replaces email/network submission. It does not contact customers or write to production.

`GARBA_AUDIT_ROOT` must point to a folder containing checkouts named `mi-punto-de-partida` (this branch) and `pdp-baseline` (commit `6ae0c6e`). `GARBA_AUDIT_OUTPUT` optionally selects the evidence folder.

Run `node tests/experience.cjs`. It exercises every diagnosis step, required-input handling, original calculation state comparison, selected-button accessibility, and phone/tablet/desktop results.
