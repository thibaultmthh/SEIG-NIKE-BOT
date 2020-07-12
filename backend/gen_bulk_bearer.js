const  { Cluster } = require('puppeteer-cluster');


const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



(async()=>{

  const get_bearer_token= async({ page, data: url }) => {
    
  }








})
