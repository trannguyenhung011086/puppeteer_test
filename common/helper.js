require('es6-promise').polyfill()
require('isomorphic-fetch')

export default class Helper {
    constructor(page) {
        this.page = page
    }

    async login_via_api() {
        const settings = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test1234@test.com',
                password: '123456789'
            })
        }
        const cookie = await fetch(process.env.HOST + '/api/v2/account/signin', settings)
            .then(response => {
                return response.headers.get('set-cookie')
            })
            .catch(e => {
                return e
            })
        return cookie
    }

    async convert_cookie(cookie) {
        return await cookie.split('; ').reduce((result, value) => {
            result[value.split('=')[0]] = value.split('=')[1]
            return result
        }, {})
    }

    async set_cookie(cookie) {
        await this.page.setCookie({
            name: 'connect.sid',
            value: cookie['connect.sid'],
            domain: cookie['Domain'],
            path: '/',
            expires: new Date(cookie['Expires']).getTime(),
            httpOnly: true,
            secure: true
        })
    }

    async get_error_text(error_selector) {
        await this.page.waitForSelector(error_selector)
        return await this.page.$eval(error_selector, el => el.textContent)
    }

    async scroll_to_element(element_selector) {
        await this.page.waitForSelector(element_selector)
        await this.page.$eval(element_selector, el => el.scrollIntoView())
    }
}