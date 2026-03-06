# AI Playwright Automation

API testing framework built with Playwright and Node.js.

## Project Structure

```
ai-playwright/
├── API/
│   ├── happy case/
│   │   ├── Login/
│   │   ├── User/
│   │   ├── Task/
│   │   └── Style/
│   └── unhappy case/
│       ├── Login/
│       └── User/
├── pages/
├── utils/
├── tests/
└── playwright.config.js
```

## Installation

Install dependencies:
```bash
npm install
```

Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in headed mode:
```bash
npm run test:headed
```

Run specific test:
```bash
npx playwright test path/to/test-file.spec.ts
```

View test report:
```bash
npm run report
```

## Tech Stack

- Playwright
- Node.js
- JavaScript
