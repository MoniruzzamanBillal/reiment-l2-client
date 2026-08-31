# 20: Order Invoice / CSV Export (Frontend)

Status: 📝 Planned, awaiting user review/approval. No code changed yet. Depends on `reiment-l2-server/context/specs/16-order-invoice-csv-export.md` landing first.

## Goal

Add an "Export CSV" button to the vendor order-history page and a "Download Invoice" action per row on the customer order-history page, consuming the new server endpoints.

## Context

`components/main/(Vendor)/OrderHistory/OrderHistory.tsx` and the customer order-history equivalent both hand-roll their `<table>` markup today (neither uses `components/common/GenericTable.tsx`) and neither has an actions column — this spec adds one to the customer table. `lib/axiosInstance.ts`'s response interceptor unconditionally reshapes every response into `{ data, meta }`, which doesn't work for a blob response — and that interceptor is also being rewritten by `21-refresh-token-flow.md`, so this feature deliberately avoids touching it.

## Design

New `lib/downloadFile.ts` helper that bypasses `axiosInstance` entirely rather than teaching its interceptor to special-case blobs — avoids coupling this feature's correctness to a change spec `21` is making to the same file. Does its own `axios.get(url, { baseURL: getBaseUrl(), withCredentials: true, responseType: "blob", headers: { Authorization: \`Bearer ${token}\` } })` (reading the `accessToken` cookie directly), then triggers a synthetic `<a>` click via an object URL to save the file. No new dependency — the browser handles blob-to-file-save natively.

## Implementation

1. `lib/downloadFile.ts` — new helper as described above.
2. `components/main/(Vendor)/OrderHistory/OrderHistory.tsx` — add an "Export CSV" button calling `downloadFile("/order/vendorShop-order-history/export", "orders.csv")`.
3. Customer order-history component — add an "Actions" column (new) with a "Download Invoice" button per row, calling `downloadFile(\`/order/${orderId}/invoice\`, \`invoice-${orderId}.pdf\`)`.

## Dependencies

Hard dependency on `reiment-l2-server/context/specs/16-order-invoice-csv-export.md`. No dependency on specs `19` or `21`.

## Verify

- As a vendor, click "Export CSV" on the order-history page — file downloads with a sane filename, opens correctly in a spreadsheet app.
- As a customer, click "Download Invoice" on an order — PDF downloads and opens with correct line items/totals.
- Confirm a network failure or 403 (e.g. testing against another customer's order id via devtools) surfaces a clear error toast rather than a silent failure or a corrupted download.
