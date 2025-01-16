const {Builder,By,until,WebDriver} = require("selenium-webdriver");
var webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const proxy = require("selenium-webdriver/proxy");
const connectdb = require("./config/dbConnection");
const Trend = require("./trendmodel");
const dotenv = require("dotenv").config();
require("chromedriver");
const express = require('express');
const path = require("path");

connectdb();
const port =3000;

const trend = new Trend({trending:{}});

const app = express();

app.use(express.static(path.join(__dirname,'public'))); 

async function example(){
    const proxymesh = process.env.http_proxy;               //proxy address
    let option = new chrome.Options().addArguments(`--proxy-server=${proxyAddress}`)
    const twitter = {"Name of trend":[]};
    let driver = new Builder().forBrowser('chrome')         //Driver that starts the browser
                             .setChromeOptions(option)
                            .build();
    
    driver.manage().window().maximize();
    driver.manage().setTimeouts({implicit:10000,pageLoad:300000});
    await driver.get("https://x.com/?lang=en");
    
    await driver.findElement(By.xpath("//span[contains(text(),'Sign in')]")).click();
  
    await driver.sleep(10000);
    // await driver.wait(
    //    until.elementLocated(By.xpath("//input[@name='text']")),20000);

    await driver.findElement(By.xpath("//input[@name='text']")).sendKeys(process.env.USERNAME);
    await driver.findElement(By.xpath("//span[contains(text(),'Next')]")).click();

    const ele = await driver.findElement(By.tagName("h1")).getText();
    if(ele==="Enter your phone number or email address"){
        await driver.findElement(By.xpath("//input[@name='text']")).sendKeys(process.env.EMAIL);
        await driver.findElement(By.xpath("//span[contains(text(),'Next')]")).click();
    }

    await driver.findElement(By.xpath("//input[@name='password']")).sendKeys(process.env.PASSWORD);
    await driver.findElement(By.xpath("(//button[@role='button'])[4]")).click();
    
    
    //await driver.wait(until.elementLocated(By.xpath("//span[contains(text(),'Trending')][1]")),20000);
    await driver.sleep(10000);
    await driver.findElement(By.xpath("//a[@aria-label='Search and explore']")).click();

    // await driver.findElement(By.xpath("//div[@class='css-175oi2r']/a/div/span")).click();
    // await driver.actions().move({origin:button}).click().perform();
   
    const element = await driver.findElements(By.xpath("//span[contains(text(),'Trending')]/parent::div/parent::div/following-sibling::div[1]/span"));
    let i=0;
    
    for(let x of element){
        
        if(await x.getText()){
            let str = await x.getText();
            twitter["Name of trend"][i++] = str;
            trend.trending.set(`Name of trend ${i}`,str);
            console.log(str);
        }
        else{
            let str = await x.findElement("//span").getText();
            twitter["Name of trend"][i++] = str;
            trend.trending.set(`Name of trend ${i}`,str) ;
            console.log(str);
        } 
        
    }
    let s= await new Date().toLocaleString();
    twitter["Date of exe"]=await s.split(",")[0];
    twitter["Time of exe"]=await s.split(",")[1].trim();
    trend.trending.set(`Date`,s.split(",")[0]);
    trend.trending.set(`Time`,s.split(",")[1].trim());
    trend.trending.set("IP Address: ","");
    await trend.save();
    await  console.log(twitter);
    return {twitter};
}


app.get('/run',async(req,res)=>{
    const trial = await example();
    res.status(200).json({trial});
})
app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
})

