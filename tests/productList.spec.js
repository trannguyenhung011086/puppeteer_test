import Puppeteer from 'puppeteer'
import ProductList from '../page_objects/productList.object'
import Helper from '../script/helper'
require('dotenv').config()

describe('Load product list', () => {
    let browser
    let page
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
        const requestUrl = process.env.HOST + '/api/menus/subitems/5b56d3448f0dd7c0480acd25/products?skip=0&limit=60&controls=true'

        await page.on('response', async response => {
            if (response.request().url() == requestUrl && response.status() == 304) {
                expect(await response.json().products.length).toEqual(numOfItems)
            }
        })

        var numWithLazyLoadedItems = await new ProductList(page).get_num_lazy_loaded_items()
        expect(numWithLazyLoadedItems).toEqual(numOfItems + 30)
    }, 30000)
})