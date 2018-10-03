import Puppeteer from 'puppeteer'

export default class Setup {
    async open_desktop_page() {
        let browser = await Puppeteer.launch({
            defaultViewport: {
                width: 1270,
                height: 720
            },
            args: ['--no-sandbox'],
            headless: false
        })
        let page = await browser.newPage()
        return {browser: browser, page: page}
    }
}