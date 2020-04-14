# Web-Scraping-with-NodeJS
## Goals of this project
  The project tries to scrape LinkedIn for the top 10 profile based on the search string which the user provides. Each of the profiles are saved in the form a .txt file.  
## Steps to use the project
1. Clone the repository into your local machine.
2. Make sure you have node installed in your computer. If it isn't installed check this link :
   [Node](https://nodejs.org/en/)
3. We are using Puppeteer to scrape LinkedIn for the top 10 accounts based on your search string. Puppeteer is a node library that we use to control a headless Chrome instance<br/> 
  Puppeteer can be very useful in :
    * scraping web pages
    * automate form submission
    * generate pdf of web pagee and many more.
4. To install puppeteer, in the terminal go to your project directory<br/> 
    `cd your-project-directory/Web-Scraping-with-NodeJS`
    `npm install puppeteer`
5. After installing puppeteer, we need to install cheerio, which is a jquery library mainly used for DOM Manipulation.
6. To install cheerio inside your project directory, run the following
    `npm install cheerio`
7. To save each of the profiles in the form of .txt files, we need to interact with the file system of our operating system. To achieve this we use the node.js file system module. To install type inside your project directory
    `npm install file-system`
7. After installing all the dependencies, we are ready to run our script.
8. To run our script type `node scrape` along with your seach string. <br/>
   For e.g. `node scrape "facebook software engineer"`
