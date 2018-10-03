import Puppeteer from 'puppeteer'
import Helper from '../common/helper'
import emulatedDevices from '../common/devices'
import ProductList from '../page_objects/productList.object'
require('dotenv').config()
let browser
let page
let devices = emulatedDevices

describe.each([devices.desktop, devices.mobile])('Lazy load product list', (device) => {
    describe('Load on ' + device.name, () => {
        beforeAll(async () => {
            browser = await Puppeteer.launch({
                args: ['--no-sandbox'],
                headless: false
            })
            page = await browser.newPage()
            await page.emulate(device)
            var cookie = await new Helper(page).login_via_api()
            cookie = await new Helper(page).convert_cookie(cookie)
            await new Helper(page).set_cookie(cookie)
        })

        afterAll(async () => {
            browser.close()
        })

        test('Lazy load new items', async () => {
            await page.goto(process.env.HOST + '/vn/subcategories/giay-dep-nam-5b56d3448f0dd7c0480acd25')

            const numOfItems = await new ProductList(page).get_num_of_items()
            const filterNum = await new ProductList(page).get_filter_num()
            expect(numOfItems).toEqual(filterNum)

            await page.on('response', async response => {
                if (response.request().url().match(/products\?skip=0&limit=60/) &&
                    response.request().method() == 'GET') {
                    expect((await response.json()).products.length).toEqual(60)
                }
            })

            await page.on('response', async response => {
                if (response.request().url().match(/products\?skip=60&limit=30/) &&
                    response.request().method() == 'GET') {
                    expect((await response.json()).products.length).toEqual(30)
                }
            })

            const numWithLazyLoadedItems = await new ProductList(page).get_num_lazy_loaded_items()
            expect(numWithLazyLoadedItems).toEqual(90)
        })
    })
})

describe('Load page', () => {
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

    test('Load page test', async () => {
        await page.goto(process.env.HOST)
    })
})