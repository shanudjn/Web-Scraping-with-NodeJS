let puppeteer = require('puppeteer')
let cheerio = require('cheerio')

const EMAIL_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const SUBMIT_SELECTOR = '#app__container > main > div > form > div.login__form_action_container > button';
const LINKEDIN_LOGIN_URL = 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin';
const SEARCH_STRING = process.argv[2];
if (process.argv[2] !== undefined) {
    (() => {
        puppeteer.launch({ headless: false })
            .then(async (browser) => {
                let page = await browser.newPage()
                page.setViewport({ width: 1366, height: 768 });
                await page.goto(LINKEDIN_LOGIN_URL, { waitUntil: 'domcontentloaded' })
                await page.click(EMAIL_SELECTOR)
                await page.keyboard.type('enter_you_email@here.com');
                await page.click(PASSWORD_SELECTOR);
                await page.keyboard.type('enter_your_password');
                await page.click(SUBMIT_SELECTOR);
                page.goto(`https://www.linkedin.com/search/results/all/?keywords=${SEARCH_STRING}&origin=GLOBAL_SEARCH_HEADER`, { waitUntil: 'domcontentloaded' })
                    .then(() => {
                        const content = page.content();
                        content
                            .then((success) => {
                                const $ = cheerio.load(success)
                                const textExtracted = $('.actor-name').text();
                                console.log(textExtracted);
                            })
                    })
            })
            .catch((err) => {
                console.log(" CAUGHT WITH AN ERROR ", err);
            })
    })()
}