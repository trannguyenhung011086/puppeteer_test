import Puppeteer from 'puppeteer'
import Helper from '../common/helper'
import emulatedDevices from '../common/devices'
import Login from '../page_objects/login.object'
require('dotenv').config()
let browser
let page
let devices = emulatedDevices

describe.each([devices.desktop, devices.mobile])('Login with invalid credentials', (device) => {
    const invalid_email_error = 'Email hoặc mật khẩu không đúng. Vui lòng thử lại'
    describe('Load on ' + device.name, () => {
        beforeAll(async () => {
            browser = await Puppeteer.launch({
                args: ['--no-sandbox'],
                headless: false
            })
            page = await browser.newPage()
            await page.emulate(device)
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
})

describe.each([devices.desktop, devices.mobile])('Login with valid credentials', (device) => {
    describe('Load on ' + device.name, () => {
        beforeAll(async () => {
            browser = await Puppeteer.launch({
                args: ['--no-sandbox'],
                headless: false
            })
            page = await browser.newPage()
            await page.emulate(device)
        })

        afterAll(async () => {
            browser.close()
        })

        test('Login with existing email', async () => {
            await page.goto(process.env.HOST + '/vn/auth/sign-in')
            await page.on('response', async response => {
                if (response.request().url().endsWith('account/signin') &&
                    response.request().method() == 'POST') {
                    expect(await response.status()).toEqual(200)
                    expect(await response.json()).toHaveProperty('email', 'test1234@test.com')
                }
            })
            await new Login(page).login_via_email('test1234@test.com', '123456789')
            await page.waitForNavigation()
            expect(page.url()).toEqual(process.env.HOST + '/vn')
        })
    })
})