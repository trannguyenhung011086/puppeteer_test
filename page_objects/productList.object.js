import Helper from '../common/helper'

export default class ProductList extends Helper {
    constructor(page) {
        super(page)
        this.page = page
        this.productList = '.jsx-3127949077.row'
        this.productNum = 'span[class="jsx-3069017056"]'
    }

    async get_filter_num() {
        await this.page.waitForSelector(this.productNum)
        return await this.page.$eval(this.productNum, el => parseInt(el.textContent.split(' ')[0]))
    }

    async get_num_of_items() {
        await this.page.waitForSelector(this.productList)
        return await this.page.$eval(this.productList, el => el.children.length)
    }

    async get_num_lazy_loaded_items() {
        await super.scroll_to_element('#footer')
        await this.page.waitForSelector(`${this.productList} > div:nth-child(90)`)
        return await this.get_filter_num()
    }
}