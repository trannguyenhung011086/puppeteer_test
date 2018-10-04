import Puppeteer from 'puppeteer'
import Helper from '../common/helper'
import emulatedDevices from '../common/devices'
import ProductList from '../page_objects/productList.object'
require('dotenv').config()
let browser
let page
let devices = emulatedDevices

describe.each([devices.desktop, devices.mobile])('Display product list', (device) => {
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
            await page.on('response', async response => {
                if (response.request().url().match(/products\?skip=0&limit=60/) &&
                    response.request().method() == 'GET') {
                    expect((await response.json()).count).toBeGreaterThan(60)
                    expect((await response.json()).products.length).toEqual(60)
                }
            })

            await page.on('response', async response => {
                if (response.request().url().match(/products\?skip=60&limit=30/) &&
                    response.request().method() == 'GET') {
                    expect((await response.json()).products.length).toEqual(30)
                }
            })

            await page.goto(process.env.HOST + '/vn/subcategories/giay-dep-nam-5b56d3448f0dd7c0480acd25')

            const numOfItems = await new ProductList(page).get_num_of_items()
            const filterNum = await new ProductList(page).get_filter_num()
            expect(numOfItems).toEqual(filterNum)

            const numWithLazyLoadedItems = await new ProductList(page).get_num_lazy_loaded_items()
            expect(numWithLazyLoadedItems).toEqual(90)
        })

        test('Display product info', async () => {
            let productData
            await page.on('response', async response => {
                if (response.request().url().match(/products\?skip=0&limit=60/) &&
                    response.request().method() == 'GET') {
                    productData = (await response.json()).products
                    return productData
                }
            })

            await page.goto(process.env.HOST + '/vn/subcategories/giay-dep-nam-5b56d3448f0dd7c0480acd25')

            let productInfo = await new ProductList(page).get_product_info(1)
            expect(productInfo.url).toContain(productData[0].id)
            expect(productInfo.brand).toEqual(productData[0].brand)
            expect(productInfo.title).toEqual(productData[0].title)
            expect(productInfo.retailPrice).toEqual(productData[0].retailPrice)
            expect(productInfo.salePrice).toEqual(productData[0].salePrice)
        })
    })
})