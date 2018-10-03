import Setup from '../common/test.setup'
import Login from '../page_objects/login.object'
require('dotenv').config()

describe('Login with valid credentials', () => {
    let browser
    let page

    beforeAll(async () => {
        let instance = await new Setup().open_desktop_page()
        browser = instance.browser
        page = instance.page
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
                expect(await response.json()).toHaveProperty('email', 'hungtn@leflair.vn')
            }
        })
        await new Login(page).login_via_email('hungtn@leflair.vn', '0944226282')
        await page.waitForNavigation()
        expect(page.url()).toEqual(process.env.HOST + '/vn')
    })
})