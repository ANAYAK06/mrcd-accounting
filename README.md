# NGO Accounts (MRCD)

A double-entry accounting web app for a non-profit organisation. Staff record payment, receipt, journal and contra vouchers, and the app produces the ledger, trial balance, income and expenditure account and balance sheet for any Indian financial year (April to March).

**Live app:** https://anayak06.github.io/mrcd-accounting (sign-in required)

## Features

- **Chart of accounts:** asset, liability, income, expense and capital accounts with opening balances; add, edit and delete accounts.
- **Vouchers:** payment, receipt, journal and contra vouchers with automatic voucher numbers. A voucher can only be saved when debits equal credits and every amount line has an account.
- **Voucher list:** search and review saved vouchers.
- **Reports:** ledger, trial balance, income and expenditure, balance sheet, and an account-wise monthly report for a chosen financial year.
- **Dashboard:** totals for assets, liabilities, income and expenditure, and the monthly surplus or deficit.
- **Users:** sign-in with a session token; administrators manage user accounts.

## Architecture

```
React (this repo, GitHub Pages)  --fetch-->  Google Apps Script web app  -->  Google Sheets
```

- **Front end:** React 19 with Tailwind CSS, hosted on GitHub Pages.
- **Back end:** a Google Apps Script web app that stores accounts, vouchers and users in Google Sheets and calculates the reports. All calls go through `src/api/api.js`.
- **Accounting rules:** pure, unit-tested helpers in `src/utils/` (`voucher.js` for balancing and validating vouchers, `financialYear.js` for April-to-March financial years).

This setup costs nothing to run, which suits a small organisation, and the data stays in the organisation's own Google account.

## Running locally

```bash
npm install
npm start          # http://localhost:3000
```

## Tests

```bash
npm test
```

Tests cover voucher validation and the financial-year calculations. They run on every push and pull request through GitHub Actions.

## Deploying

```bash
npm run deploy     # builds and publishes to GitHub Pages
```

## Tech stack

React 19 · Tailwind CSS · Google Apps Script · Google Sheets · Jest and Testing Library · GitHub Actions · GitHub Pages
