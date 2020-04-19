let puppeteer = require("puppeteer");
let cheerio = require("cheerio");
let fs = require("file-system");

var links = [];
var page;

const EMAIL_SELECTOR = "#username";
const PASSWORD_SELECTOR = "#password";
const SUBMIT_SELECTOR =
  "#app__container > main > div > form > div.login__form_action_container > button";
const LINKEDIN_LOGIN_URL =
  "https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin";
const SEARCH_STRING =
  process.argv[2]; /*+ " " + process.argv[3] + " " + process.argv[4];*/

//helper function to scroll the target page
const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

//helper function get the profile links from the target page 
async function getDataFromPage() {
  const content = page.content();
  return content
    .then((success) => {
      const $ = cheerio.load(success);
      let divClass = $(".search-results__list").find("li");
      //console.log(divClass.attr('class'));
      let listLength = divClass.length;
      //console.log(listLength);
      divClass.each(function (i, element) {
        const targetUl = $(element).find(
          ".search-result__info,.pt3, .pb4, .ph0"
        );
        //console.log(targetUl.attr('class'));
        const name = $(targetUl).find(".name, .actor-name").text();
        const link = $(targetUl).find("a").attr("href");
        links.push(link);
      });
      return links;
    })
    .catch((err) => {
      console.log(" CAUGHT WITH AN ERROR ", err);
    });
}

//main
if (process.argv[2] !== undefined) {
  (() => {
    puppeteer
      .launch({ headless: true })
      .then(async (browser) => {
        page = await browser.newPage();
        page.setViewport({ width: 1366, height: 768 });
        await page.goto(LINKEDIN_LOGIN_URL, { waitUntil: "domcontentloaded" });

        await page.click(EMAIL_SELECTOR);
        await page.keyboard.type("your@email.com");
        await page.click(PASSWORD_SELECTOR);
        await page.keyboard.type("password");
        await page.click(SUBMIT_SELECTOR);

        await page.goto(
          `https://www.linkedin.com/search/results/people/?keywords=${SEARCH_STRING}&origin=CLUSTER_EXPANSION`,
          { waitUntil: "domcontentloaded" }
        );

        await autoScroll(page);

        var data = await getDataFromPage();      
      
        //loop through each profile links and save the profile page as a txt file inside project directory.
        for (let i = 0; i < data.length; i++) {
          //console.log("Link " + i + " : " + data[i]);
          let newPage = await browser.newPage();
          let newurl = "https://www.linkedin.com" + data[i];
          await newPage.goto(newurl, { waitUntil: "networkidle2" });
          let childHtml = await newPage.content();
          fs.writeFile(`file${i}.txt`, childHtml);
          //console.log(childHtml);
          newPage.close();
        }
        browser.close();
      })
      .catch((err) => {
        console.log(" CAUGHT WITH AN ERROR ", err);
      });
  })();
}
