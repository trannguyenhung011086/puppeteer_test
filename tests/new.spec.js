import Puppeteer from 'puppeteer'
import Helper from '../common/helper'
import emulatedDevices from '../common/devices'
import ProductList from '../page_objects/productList.object'
require('dotenv').config()
let browser
let page
let devices = emulatedDevices

describe.only('Display product info', () => {
    beforeAll(async () => {
        browser = await Puppeteer.launch({
            args: ['--no-sandbox'],
            headless: false
        })
        page = await browser.newPage()
        await page.emulate(devices.desktop)
        var cookie = await new Helper(page).login_via_api()
        cookie = await new Helper(page).convert_cookie(cookie)
        await new Helper(page).set_cookie(cookie)
    })

    afterAll(async () => {
        browser.close()
    })

    test('New test', async () => {
        // new test here before adding to suite
    })
})