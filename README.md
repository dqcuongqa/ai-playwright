# AI Playwright Automation
Automation testing framework for API testing using **Playwright** and **Node.js**.
## Project Structure
├── API/
│   ├── happy-case/
│   └── unhappy-case/
├── pages/
├── tests/
├── utils/
├── test-results/
├── playwright.config.js
├── package.json
└── .env.example

## Installation
Install dependencies and Playwright browsers:

```bash
npm install
npx playwright install

Environment Setup
Create a .env file based on .env.example and configure environment variables.
Example:
BASE_URL=your_api_url
API_USERNAME=your_username
API_PASSWORD=your_password

Run Tests
Run all tests:
npm test

Run Tests
Run all tests:
npm test

Run tests in headed mode:
npm run test:headed

View HTML report:
npm run report

## Tech Stack
**Playwright • Node.js • JavaScript**
