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
                return response.headers.get('set-cookie').split('; ').reduce((result, value) => {
                    result[value.split('=')[0]] = value.split('=')[1];
                    return result;
                }, {})
            })
            .catch(e => {
                return e
            })
        return cookie
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
        await this.page.waitForSelector(error_selector, {
            visible: true
        })
        return await this.page.$eval(error_selector, el => el.textContent)
    }

    async scroll_to_footer() {
        await this.page.evaluate(() => window.scrollTo(0, document.querySelector('#footer').offsetTop))
    }
}