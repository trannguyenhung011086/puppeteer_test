import puppeteer from 'puppeteer'
import Login from '../page_objects/login'
import Helper from '../helper'
require('dotenv').config()

describe('Login via email on desktop theme', () => {
    let browser
    let page
    let cookie
    const width = 1280
    const height = 720
    beforeEach(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: [
                `--window-size=${width},${height}`
            ],
            defaultViewport: { width, height }
        })
        page = await browser.newPage()
    })

    afterEach(async () => {
        await page.close()
        await browser.close()
    })

    test('Login with API', async () => {
        cookie = await new Helper(page).login_via_api()
        await new Helper(page).set_cookie(cookie)
        await page.goto(process.env.HOST)
        await page.waitForSelector('.my-account-dropdown__dropdown___1t30T')
    }, 10000)

    test('Login with non-existing email', async () => {
        await page.goto(process.env.HOST + '/auth/signin?redirect=/')
        await page.on('response', response => {
            if (response.request().url().endsWith('account/signin')
                && response.request().method() == 'POST') {
                expect(response.status()).toEqual(401)
            }
        })
        await new Login(page).login_via_email('test@test.com', 'test')
        await page.waitForResponse(process.env.HOST + '/api/v2/account/signin')
    }, 10000)
})