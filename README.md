# 🎭 AI Playwright Automation

A comprehensive API testing framework built with Playwright and Node.js, featuring organized test suites for both happy and unhappy path scenarios.

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [Test Organization](#-test-organization)
- [Tech Stack](#-tech-stack)

## ✨ Features

- Comprehensive API test coverage (Login, User, Task, Style modules)
- Organized test structure with happy and unhappy case scenarios
- Environment-based configuration for secure credential management
- Page Object Model (POM) architecture
- Detailed HTML test reports
- Reusable authentication helpers

## 📁 Project Structure

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
│   └── auth.helper.ts
├── tests/
├── test-results/
├── playwright.config.js
├── package.json
├── .env.example
└── .env (gitignored)
```

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/dqcuongqa/ai-playwright.git
cd ai-playwright
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## ⚙️ Configuration

1. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:
```env
BASE_URL=your_api_base_url
API_USERNAME=your_username
API_PASSWORD=your_password
```

> **Note:** Never commit the `.env` file to version control. It contains sensitive credentials.

## 🧪 Running Tests

Run all tests:
```bash
npm test
```

Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

Run specific test file:
```bash
npx playwright test path/to/test-file.spec.ts
```

Run tests by grep pattern:
```bash
npx playwright test --grep "Login"
```

View HTML test report:
```bash
npm run report
```

## 📊 Test Organization

### Happy Case Tests
- **Login**: Successful authentication scenarios
- **User**: CRUD operations (Create, Read, Update, Delete)
- **Task**: Task management operations
- **Style**: Style resource operations

### Unhappy Case Tests
- **Login**: Invalid credentials, missing fields, unauthorized access
- **User**: Validation errors, duplicate entries, invalid data

## 🛠️ Tech Stack

- **Playwright** - Modern end-to-end testing framework
- **Node.js** - JavaScript runtime
- **TypeScript/JavaScript** - Programming language
- **dotenv** - Environment variable management

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**dqcuongqa**

- GitHub: [@dqcuongqa](https://github.com/dqcuongqa)

---

Made with ❤️ using Playwright
