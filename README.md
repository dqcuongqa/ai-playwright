# Playwright Automation Framework

Framework automation test sử dụng Playwright và Node.js

## Cấu trúc thư mục

```
├── pages/              # Page Object Models
├── tests/              # Test cases
├── utils/              # Helper functions
├── test-results/       # Test reports
└── playwright.config.js
```

## Cài đặt

```bash
npm install
npx playwright install
```

## Chạy tests

```bash
# Chạy tất cả tests
npm test

# Chạy với UI
npm run test:headed

# Chạy trên browser cụ thể
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Xem report
npm run report
```

## Tạo test mới

Tạo file trong thư mục `tests/` và sử dụng Page Objects từ `pages/`
