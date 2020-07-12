// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())



//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
//puppeteer.use(StealthPlugin())

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function get_bearer_token(username, password, proxy) {
  console.log("--proxy-server=http://" + proxy.domain + ":" + proxy.port);
  const browser = await puppeteer.launch({

    args: ['--enable-features=NetworkService', "--proxy-server=http://" + proxy.domain + ":" + proxy.port],
    ignoreHTTPSErrors: true,
    slowMo:10,
    headless: false

  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  await page.authenticate({
    username: proxy.username,
    password: proxy.password,
  });
  var auth_data = {"bearer_token": "","refresh_token": "", "client_id": "", "user_id": "", "expires":0}

  const regex = /nike.com\/login/

  page.on('response', async response => {
    const url = response.url()
    if (regex.test(url)) {
      try {
        const req = response.request();
        const orig = req.url();
        const text = await response.text();
        const json = await response.json();
        const status = response.status();

        if (json.token_type == "bearer") {
          auth_data.bearer_token = json.access_token
          auth_data.user_id = json.user_id
          console.log("bearer set");
        }
      } catch (err) {
        console.error(`Failed getting data from: ${url}`);
        //console.error(err);
      }
    }
  });

  page.on("request", request => {
    if (regex.test(request.url())){
      try{
        let data = JSON.parse(request.postData())
        console.log(data);
      }
      catch (err) {
        console.log("oups");
      }

    }

    request.continue()
  })








  var ok = false
  while (!ok) {
    try {
      await page.goto('https://www.nike.com/fr/launch?s=in-stock', {
        timeout: 100000
      });

    ok = true
  } catch (err) {
    console.log(err.message);
  }
}






  console.log("E");
  await page.click('#root > div > div > div.main-layout > div > header > div.d-lg-h.d-sm-b > section > div.prl4-sm.prl7-lg.va-sm-m.ta-sm-r > button')
  await page.screenshot({
    path: 'myscreenshot1.png',
    fullPage: true
  });
  await sleep(1213)
  await page.click('#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button')

  console.log("A");
  await sleep(3223)
  console.log("A");

  await page.focus('#nike-unite-loginForm > div > input[type=email]')
  await page.keyboard.type(username);
  await sleep(3523)

  await page.focus('#nike-unite-loginForm > div > input[type=password]')
  await page.keyboard.type(password);

  await sleep(1405)
  await page.click('#nike-unite-loginForm > div > input[type=button]')
  await sleep(5040)


  // #nike-unite-loginForm > div.nike-unite-text-input.emailAddress.nike-unite-component.blurred.valid
  let a = 0
  while(a < 10){
    await sleep(8000)
    a = a +1
    await page.screenshot({
      path: 'myscreenshot3.png',
      fullPage: true
    });
    if (auth_data.bearer_token != ""){a= 10}
  }

  await browser.close();
  return auth_data
};

/*
var proxy = {
  domain: "lunar.astroproxies.com",
  "port": "7777",
  "username": "customer-astro_4198358-cc-fr-sessid-uhJFFZgKsHar",
  password: "bdc984c262"
}




get_bearer_token("bastiOne@gmx.de", "Schuhe123#", proxy).then(bearer_token => {
  console.log(bearer_token)
})
*/
module.exports.get_bearer_token = get_bearer_token

/* proxys
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-McGdpr5fHcuN:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-PTHnYsMiKYqW:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-HFlABx1zMV3q:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-RRTrGprKVhTF:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-OTb3r73bscJg:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-FuvdwEAYO4X5:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-3IgWwge5yIfk:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-hXaiLFh3ujBH:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-TwShA6wjBZrX:bdc984c262
lunar.astroproxies.com:7777:customer-astro_4198358-cc-fr-sessid-uhJFFZgKsHar:bdc984c262
*/









/*
//#root > div > div > div.main-layout.no-scroll > nav > ul > li:nth-child(1) > button


#nike-unite-loginForm > input[type=email]
#nike-unite-loginForm > input[type=password]
#nike-unite-loginForm > input[type=button]

//#root > div > div > div.main - layout.no - scroll > nav > ul > li: nth - child(1) > button
*/
