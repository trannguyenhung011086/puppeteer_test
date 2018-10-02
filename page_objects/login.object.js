import Helper from '../script/helper'

export default class Login extends Helper {
    constructor(page) {
        super(page)
        this.page = page
        this.emailField = '#email'
        this.passwordField = '#password'
        this.submitBtn = 'button[type="submit"]'
        this.errorMsg = '.alert.alert-danger'
        this.accountMenu = 'div[data-dd-menu-trigger="true"]'
    }

    async login_via_email(email, password) {
        await this.page.type(this.emailField, email)
        await this.page.type(this.passwordField, password)
        await this.page.click(this.submitBtn)
    }

    async get_login_error() {
        return super.get_error_text(this.errorMsg)
    }
}