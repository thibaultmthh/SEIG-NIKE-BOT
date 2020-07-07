const {Users_DS, Payment_methods_DS,Address_DS} = require("./data_management.js")
const {
  get_bearer_token
} = require("./bearer_get.js")

const {set_address, set_payment_method} = require("./set_info.js")
/*
const user_ds = new Users_DS()
const payment_methods_DS = new PaymentMethods_DS()
const address_ds = new Address_DS()
*/



var address = {
  "firstName": "Thibault",
  "lastName": "Mathian",
  "address1": "88 le sausey",
  "address2": "",
  "address3": "",
  "state": "",
  "city": "Laval",
  "postalCode": "38190",
  "country": "FR",
  "phoneNumber": "0769933717",
  "email": "thibault.mathian@free.fr"
}

var card_info = {
  "accountNumber": "5355861838818404",
  "cardType": "MASTERCARD",
  "expirationMonth": "04",
  "expirationYear": "2025",
  "cvNumber": "249"
}

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
  "payment_method": card_info,
  "address": address,
  "nike_pay_id": "",
  "nike_address_id": "",
  "nike_user_id":"",
  "status": "waiting",
  "error": {"text": ""}
}



async function add_account(profile, address, card_info){
  auth_data = await get_bearer_token(profile.username, profile.password, profile.proxy)
  console.log(auth_data.user_id,"is the user id")
  if (auth_data.bearer_token != ""){
    set_address(auth_data.bearer_token,profile.proxy,auth_data.user_id, address)
    set_payment_method(auth_data.bearer_token, profile.proxy, card_info, address)

  }

}


add_account(profile, address, card_info)



//
