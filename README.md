# Playwright Automation Framework

Framework automation test sử dụng Playwright và Node.js cho API testing

## Cấu trúc thư mục

```
├── API/
│   ├── happy case/      # Test cases thành công
│   └── unhappy case/    # Test cases thất bại
├── pages/               # Page Object Models
├── utils/               # Helper functions
├── test-results/        # Test reports
└── playwright.config.js
```

## Cài đặt

```bash
npm install
npx playwright install
```

## Cấu hình

1. Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Cập nhật thông tin trong file `.env`:
```
BASE_URL=your_api_url
API_USERNAME=your_username
API_PASSWORD=your_password
```

⚠️ **LƯU Ý**: File `.env` chứa thông tin nhạy cảm và đã được thêm vào `.gitignore`. KHÔNG commit file này lên Git.

## Chạy tests

```bash
# Chạy tất cả tests
npm test

# Chạy với UI
npm run test:headed

# Chạy với Playwright UI mode
npm run test:ui

# Xem report
npm run report
```

## Bảo mật

- Tất cả thông tin nhạy cảm (URL, credentials) được lưu trong file `.env`
- File `.env` đã được thêm vào `.gitignore`
- Chỉ commit file `.env.example` với giá trị mẫu
