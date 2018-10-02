import Helper from '../script/helper'

export default class ProductList extends Helper {
    constructor(page) {
        super(page)
        this.page = page
        this.productList = '.jsx-3127949077.row'
    }

    async get_num_of_items() {
        return await this.page.$eval(this.productList, el => el.children.length)
    }

    async get_num_lazy_loaded_items() {
        await super.scroll_to_footer()
        let finalItem = await this.get_num_of_items() + 30
        await this.page.waitForSelector(`${this.productList} > div:nth-child(${finalItem})`)
        return await this.page.$eval(this.productList, el => el.children.length)
    }
}