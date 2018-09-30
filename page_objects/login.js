export default class Login {
    constructor (page) {
        this.page = page
        this.emailField = 'input[type="email"]'
        this.passwordField = 'input[type="password"]'
        this.submitBtn = 'button[type="submit"]'
    }
    async login_via_email (email, password) {
        await this.page.type(this.emailField, email)
        await this.page.type(this.passwordField, password)
        await this.page.click(this.submitBtn)
    }
}