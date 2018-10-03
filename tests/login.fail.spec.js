import Puppeteer from 'puppeteer'
import Login from '../page_objects/login.object'
require('dotenv').config()

describe('Login with invalid credentials', () => {
    let browser
    let page
    const invalid_email_error = 'Email hoặc mật khẩu không đúng. Vui lòng thử lại'

    beforeAll(async () => {
        browser = await Puppeteer.launch({
            defaultViewport: {
                width: 1270,
                height: 720
            },
            args: ['--no-sandbox'],
            headless: false
        })
        page = await browser.newPage()
    })

    afterAll(async () => {
        browser.close()
    })

    test('Login with wrong password', async () => {
        await page.goto(process.env.HOST + '/vn/auth/sign-in')
        await page.on('response', async response => {
            if (response.request().url().endsWith('account/signin') &&
                response.request().method() == 'POST') {
                expect(await response.status()).toEqual(401)
                expect(await response.json()).toHaveProperty('message', 'EMAIL_PASSWORD_INCORRECT')
            }
        })
        await new Login(page).login_via_email('hungtn@leflair.vn', 'test')
        const text = await new Login(page).get_login_error()
        expect(text).toEqual(invalid_email_error)
    })

    test('Login with non-existing email', async () => {
        await page.goto(process.env.HOST + '/vn/auth/sign-in')
        await page.on('response', async response => {
            if (response.request().url().endsWith('account/signin') &&
                response.request().method() == 'POST') {
                expect(await response.status()).toEqual(401)
                expect(await response.json()).toHaveProperty('message', 'EMAIL_PASSWORD_INCORRECT')
            }
        })
        await new Login(page).login_via_email('test@test.vn', 'test')
        const text = await new Login(page).get_login_error()
        expect(text).toEqual(invalid_email_error)
    })
})