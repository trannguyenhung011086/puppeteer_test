# Use puppeteer to test web app and capture XHR response for testing

## Puppeteer + Jest
- [GitHub - GoogleChrome/puppeteer: Headless Chrome Node API](https://github.com/GoogleChrome/puppeteer)
- [Jest · 🃏 Delightful JavaScript Testing](https://jestjs.io/)

### Why use Puppeteer
- bundled with Chromium and built by Chrome-dev tool
- **ability to capture XHR request while loading page** -> this will be convenient when testing load page on browser and compare with result returned from API requests without using a separate call to API
- **ability to intercept XHR request then fake response for testing** -> this will be convenient when testing error message case on browser

### Why use Jest
- built-in parallel testing
- native unit test type for React app
