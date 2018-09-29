import puppeteer from 'puppeteer'
require('dotenv').config()

describe('Test puppeteer with Jest', () => {
    let browser
    let page
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1280, height: 720 }
        })
        page = await browser.newPage()
    })

    afterAll(async () => {
        await page.close()
        await browser.close()
    })

    test('First test', async () => {
        await page.goto(process.env.HOST + '/auth/signin?redirect=/')
        await page.type('input[type="email"]', 'test@mail.com')
        await page.type('input[type="password"]', 'test')
        await page.on('response', response => {
            if (response.request().url().endsWith('account/signin')
                && response.request().method() == 'POST') {
                expect(response.status()).toEqual(400)
            }
        })
        await page.click('button[type="submit"]')
        await page.waitForResponse(process.env.HOST + '/api/v2/account/signin')
    }, 30000)
})