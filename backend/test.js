const {
  get_bearer_token
} = require("./bearer_get.js")



var proxy = {
  domain: "lunar.astroproxies.com",
  port: "7777",
  username: "customer-astro_4198358-cc-fr-sessid-hXaiLFh3ujBH",
  password: "bdc984c262"
}

var profile = {
    "username": "bastiTricky@gmx.de",
    'password': "Schuhe123#",
    "proxy": proxy,
    "bearer_token": "",
    "expire": 0,}


async function test() {
  var a =   get_bearer_token(profile.username, profile.password, profile.proxy).then((r)=>{console.log(r, "ahah fini ");})
  var a =   get_bearer_token(profile.username, profile.password, profile.proxy).then((r)=>{console.log(r, "ahah fini ");})
  var a =   get_bearer_token(profile.username, profile.password, profile.proxy).then((r)=>{console.log(r, "ahah fini ");})
    var a =   get_bearer_token(profile.username, profile.password, profile.proxy).then((r)=>{console.log(r, "ahah fini ");})
    console.log("fin", a);
  }

test()
