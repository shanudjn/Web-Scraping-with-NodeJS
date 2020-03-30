let puppeteer = require('puppeteer')
let cheerio = require('cheerio')
var page ;

const EMAIL_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const SUBMIT_SELECTOR = '#app__container > main > div > form > div.login__form_action_container > button';
const LINKEDIN_LOGIN_URL = 'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin';
const SEARCH_STRING = process.argv[2]+" "+process.argv[3]+" "+process.argv[4] ;
if (process.argv[2] !== undefined) {
    (() => {
        puppeteer.launch({ headless: false })
            .then(async (browser) => {
                page = await browser.newPage()
                page.setViewport({ width: 1366, height: 768 });
                await page.goto(LINKEDIN_LOGIN_URL, { waitUntil: 'domcontentloaded' })
                await page.click(EMAIL_SELECTOR)
                await page.keyboard.type('shanudjn@gmail.com');
                await page.click(PASSWORD_SELECTOR);
                await page.keyboard.type('Shahazad@123');
                await page.click(SUBMIT_SELECTOR);
                
                await page.goto(`https://www.linkedin.com/search/results/people/?keywords=${SEARCH_STRING}&origin=CLUSTER_EXPANSION`, { waitUntil: 'domcontentloaded' })
                var data  = await getPage(); 
                console.log(data);                      
                    })                                
                    
            .catch((err) => {
                console.log(" CAUGHT WITH AN ERROR ", err);
            })
    })();
    //console.log(data);
  function getPage(){
    const content = page.content();    
    return content.then((success) => {                               
            const $ = cheerio.load(success)
            const div = $('.search-results__list');                                
            console.log(div.attr('class'));
            var targetUrl = div.children().children().children().children('.search-result__info', '.pt3', '.pb4', '.ph0').children();
            //var targetUrl = div.('li:nth-child(3)')                                
            console.log(targetUrl.attr('class'));
            console.log(targetUrl.attr('href'));           
            
            return targetUrl.attr('class');                                
        })
    //return hello;            
  }
}