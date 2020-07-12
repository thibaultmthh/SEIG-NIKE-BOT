const {
  Users_DS,
  Payment_methods_DS,
  Address_DS
} = require("./data_management.js")
const {
  get_bearer_token
} = require("./bearer_get.js")

/*
const user_ds = new Users_DS()
const payment_methods_DS = new PaymentMethods_DS()
const address_ds = new Address_DS()
*/

user_ds = new Users_DS()
payment_methods_ds = new Payment_methods_DS()
address_ds = new Address_DS()





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
  "id_info":{
    "bearer_token": "",
    "refresh_token": "",
    "client_id": "",
    "expire": 0,
    "user_id": ""
  }

}




/*
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
  //"email": "thibault.mathian@free.fr"
}



var card_info = {
  "accountNumber": "5355861838818404",
  "cardType": "MASTERCARD",
  "expirationMonth": "04",
  "expirationYear": "2025",
  "cvNumber": "249"
}

*/



/*
"nike_pay_id": "",
"nike_address_id": "",
"status": "waiting",
"error": []
*/

//console.log(address_ds.add_D(address), " id address");
//console.log(payment_methods_ds.add_D(card_info), " id pay");




function set_payment_method(bearer_token, proxy, card_info) {
  let ccinfoid = uuidv4()
  store_headers = {}
  store_payload = card_info
  store_payload.creditCardInfoId = ccinfoid
  store_url = 'https://paymentcc.nike.com/creditcardsubmit/' + ccinfoid + '/store'

  is_valid_headers = {}
  is_valid_url = "https://paymentcc.nike.com/creditcardsubmit/" + ccinfoid + "/isValid?mode=1"

  savepayment_headers = {
    "Authorization": "Bearer " + bearer_token
  }
  savepayment_payload = {
    "type": "CreditCard",
    "creditCardInfoId": ccinfoid,
    "isDefault": true,
    "currency": "USD",
    "billingAddress": address
  }
  savepayment_url = "https://api.nike.com/commerce/storedpayments/consumer/savepayment"

  var proxyUrl = "http://" + proxy.username + ":" + proxy.password + "@" + proxy.domain + ":" + proxy.port;
  var proxiedRequest = request.defaults({
    'proxy': proxyUrl
  });
  proxiedRequest.post({
    url: store_url,
    json: store_payload,
  }, (err, res, body) => {
    if (err != null) {
      console.log("err");
      return
    }
    console.log(res.statusCode, body);

    if (res.statusCode == 201) {
      proxiedRequest.get({
        url: is_valid_url,

      }, (err, res, body) => {
        if (err != null) {
          console.log("err");
          return
        }
        console.log(res.statusCode, body);
        if (res.statusCode == 200) {
          proxiedRequest.post({
            url: savepayment_url,
            headers: savepayment_headers,
            json: savepayment_payload

          }, (err, res, body) => {
            if (err != null) {
              console.log("err");
              return
            }
            console.log(res.statusCode, body);
            if (res.statusCode == 201 && body.status == "success") {
              console.log("successfully add payment method");
            }
          })
        }
      })
    }
  })
}







function set_address(bearer_token, proxy, user_id, address) {
  let headers = {
    'Authorization': 'Bearer ' + bearer_token,
    'x-nike-ux-id': ' HlHa2Cje3ctlaOqnxvgZXNaAs7T9nAuH'
  }
  let payload = {
    "code": address.postalCode,
    "country": address.country,
    "line1": address.address1,
    "line2": address.address2,
    "line3": address.address3,
    "locality": address.city,
    "name": {
      "kana": {
        "family": "",
        "given": ""
      },
      "primary": {
        "family": address.lastName,
        "given": address.firstName
      }
    },
    "phone": {
      "primary": address.phoneNumber
    },
    "preferred": true,
    "province": address.province,
    "zone": ""
  }
  var url = "https://api.nike.com/identity/user/v1/" + user_id + "/address"
  var proxyUrl = "http://" + proxy.username + ":" + proxy.password + "@" + proxy.domain + ":" + proxy.port;
  var proxiedRequest = request.defaults({
    'proxy': proxyUrl
  });

  proxiedRequest.post({
    url: url,
    headers: headers,
    json: payload
  }, (err, res, body) => {
    if (err != null) {
      console.log("err");
      return
    }
    console.log(res.statusCode, body);
    console.log("address Set !");
  })




}


async function add_account(profile, users_ds, payment_methods_ds, address_ds) {
  address = address_ds.get_D(profile.address_id)
  card_info = payment_methods_ds.get_D(profile.pay_id)
  profile.status = "waiting"
  profile.error = []
  users_ds.add_D(profile)
  auth_data = await get_bearer_token(profile.username, profile.password, profile.proxy)
  console.log(auth_data.user_id, "is the user id")
  if (auth_data.bearer_token != "") {
    set_address(auth_data.bearer_token, profile.proxy, auth_data.user_id, address)
    set_payment_method(auth_data.bearer_token, profile.proxy, card_info, address)


  }

}


module.exports.add_account = add_account



//
