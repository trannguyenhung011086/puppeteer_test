require('es6-promise').polyfill();
require('isomorphic-fetch');

export default class Helper {
    constructor(page) {
        this.page = page
    }
    async login_via_api() {
        let cookie
        const settings = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: 'test1234@test.com', password: '123456789' })
        }
        cookie = await fetch(process.env.HOST + '/api/v2/account/signin', settings)
            .then(response => {
                return response.headers.get('set-cookie').split('; ').reduce(function (result, v, i, a) { var k = v.split('='); result[k[0]] = k[1]; return result; }, {})
            })
            .catch(e => {
                return e
            })
        return cookie
    }
    async set_cookie(cookie) {
        this.page.setCookie({
            name: 'connect.sid',
            value: cookie['connect.sid'],
            domain: cookie['Domain'],
            path: '/',
            expires: new Date(cookie['Expires']).getTime(),
            httpOnly: true,
            secure: true
        })
    }
}