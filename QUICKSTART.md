# Quick Start Guide - 5 Minutes

Get up and running with the SteroyalBank automation suite in 5 minutes!

## Step 1: Install Dependencies (1 minute)

```bash
npm install
```

## Step 2: Configure Environment (1 minute)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your test credentials:

```env
VALID_USERNAME=your_username@example.com
VALID_PASSWORD=your_password_here
```

## Step 3: Run Your First Test (1 minute)

```bash
npm run test:login
```

You'll see:
- ✅ Tests running
- 📊 Real-time output
- 📸 Screenshots on failure
- 📝 Test logs

## Step 4: View Reports (1 minute)

```bash
npm run test:report
```

Opens interactive HTML report showing:
- Test results
- Execution time
- Screenshots
- Test logs

## Step 5: Add Your First Test (1 minute)

1. Open `data/loginTestData.json`
2. Add new test case:

```json
{
  "your_test_case": {
    "username": "user@example.com",
    "password": "password123",
    "description": "Your test description"
  }
}
```

3. Run tests again: `npm run test:login`

## Commands Cheat Sheet

```bash
npm test              # Run all tests
npm run test:headed   # Run with browser visible
npm run test:debug    # Debug mode
npm run test:login    # Login tests only
npm run test:report   # Generate HTML report
npm run lint          # Check code quality
npm run format        # Auto-format code
```

## Project Structure at a Glance

```
src/
  ├── pages/           # Page objects (LoginPage.ts)
  ├── tests/           # Test files (login.spec.ts)
  └── utils/           # Utilities (Logger, TestDataManager)
data/                  # Test data (loginTestData.json)
reports/               # Test results & screenshots
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/pages/LoginPage.ts` | Login page interactions |
| `src/tests/login.spec.ts` | Login test cases |
| `data/loginTestData.json` | Test data |
| `config/testConfig.ts` | Configuration |
| `playwright.config.ts` | Playwright settings |

## Troubleshooting

### Tests won't run
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### Tests timeout
- Check internet connection
- Increase timeout in `playwright.config.ts`
- Verify credentials in `.env`

### Can't find elements
- Update selectors in `src/pages/LoginPage.ts`
- Use browser DevTools to inspect elements
- Check if element is dynamic

## Next Steps

1. **Read Full Guide**: Open [README.md](README.md)
2. **Explore Page Objects**: Check [LoginPage.ts](src/pages/LoginPage.ts)
3. **Add More Tests**: Use [login.spec.ts](src/tests/login.spec.ts) as template
4. **Create New Pages**: Follow POM pattern for new pages

## Support

Check logs in `reports/logs/` for detailed information.

---

✅ Ready? Run `npm install && npm run test:login` and see it in action!
