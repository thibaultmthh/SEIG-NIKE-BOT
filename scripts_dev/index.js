const request = require("request")
const {
  v4: uuidv4
} = require('uuid');





function make_request_post(proxy, url, headers, payload, session, rcallback) {
  var proxyUrl = "http://" + proxy.username + ":" + proxy.password + "@" + proxy.domain + ":" + proxy.port;

  var proxiedRequest = request.defaults({
    'proxy': proxyUrl
  });
  proxiedRequest.post({
    url: url,
    headers: headers,
    json: payload,
    jar: session
  }, (err, res, body) => {
    if (err != null) {
      console.log("err");
      console.log(err.message);;
      return
    }
    if (res.statusCode == 200 || res.statusCode == 202 ) {
      rcallback(body)

    }
    else {
      console.log(res.statusCode);
      console.log(body);
      return
      }


  })


}


function make_request_put(proxy, url, headers, payload, session, rcallback) {
  var proxyUrl = "http://" + proxy.username + ":" + proxy.password + "@" + proxy.domain + ":" + proxy.port;

  var proxiedRequest = request.defaults({
    'proxy': proxyUrl
  });
  proxiedRequest.put({
    url: url,
    headers: headers,
    json: payload,
    jar: session
  }, (err, res, body) => {
    if (err != null) {
      console.log("err");
      return
    }
    if (res.statusCode != 202) {
      console.log(res.statusCode);
      console.log(body);
      return
    }
    rcallback(body)
  })
}

function make_request_get(proxy, url, headers, payload, session, rcallback) {
  var proxyUrl = "http://" + proxy.username + ":" + proxy.password + "@" + proxy.domain + ":" + proxy.port;

  var proxiedRequest = request.defaults({
    'proxy': proxyUrl
  });
  proxiedRequest.get({
    url: url,
    headers: headers,
    json: payload,
    jar: session
  }, (err, res, body) => {
    if (err != null) {
      console.log("err");
      return
    }
    if (res.statusCode != 200) {
      console.log(res.statusCode);
      console.log(body);
      return
    }
    rcallback(body)
  })
}





function co1() {
  headers = {
    "authority": "api.nike.com",
    "method": "POST",
    "path": "/payment/options/v2",
    "scheme": "https",
    "accept": "*/*",
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-type": "application/json",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-caller-id": "nike:sneakrs:ios:1.1",
  }

  payload = {
    "total": total,
    "items": [item_info.item_uuid],
    "billingCountry": "FR",
    "currency": "EUR",
    "country": "FR"
  }
  url = "https://api.nike.com/payment/options/v2"
  make_request_post(proxy, url, headers, payload, session, (body) => {
    if (body.paymentOptions === undefined) {
      console.log("No payment options found");
      return
    }
    //console.log(body);
    co2()
  })

}

function co2() {
  headers = {
    "authority": "api.nike.com",
    "method": "POST",
    "path": "/buy/shipping_options/v2",
    "scheme": "https",
    "accept": "application/json",
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-type": "application/json; charset=utf-8",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-caller-id": "nike:sneakrs:ios:1.1",
  }
  global.shippingUUID = uuidv4()
  payload = {
    "items": [{
      "id": shippingUUID,
      "shippingAddress": {
        "postalCode": profile.zip,
        "address1": profile.address,
        "city": profile.city,
        "country": "FR"
      },
      "skuId": item_info.sku_uuid
    }],
    "currency": "EUR",
    "country": "FR"
  }
  url = 'https://api.nike.com/buy/shipping_options/v2'
  make_request_post(proxy, url, headers, payload, session, (body) => {

    console.log(body, body.items)
    if (body.items === undefined) {
      console.log("2/4 checkout (error 613)");
    } else {
      console.log("Checkout 2/3");
      co3()
    }

  })
}


function co3() {
  global.checkoutUUID = uuidv4()
  headers = {
    "authority": "api.nike.com",
    "method": "PUT",
    "path": "/buy/checkout_previews/v2/" + checkoutUUID,
    "scheme": "https",
    "accept": "application/json",
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-type": "application/json",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-caller-id": "nike:sneakrs:ios:1.1",
  }
  payload = {
    "request": {
      "email": profile.email,
      "clientInfo": {
        //"deviceId": deviceId,
        "client": "com.nike.commerce.snkrs.v2.ios"
      },
      "currency": "EUR", //todo
      "items": [{
        "recipient": {
          "lastName": profile.lname,
          "firstName": profile.fname
        },
        "shippingAddress": {
          "city": profile.city,
          "address1": profile.address,
          "postalCode": profile.zip,
          "country": "FR"
        },
        "id": shippingUUID,
        "quantity": 1,
        "skuId": item_info.sku_uuid,
        "shippingMethod": "GROUND_SERVICE",
        "contactInfo": {
          "phoneNumber": profile.phone,
          "email": profile.email
        }
      }],
      "channel": "SNKRS",
      "locale": "fr_FR",
      "country": "FR"
    }
  }
  url = 'https://api.nike.com/buy/checkout_previews/v2/' + checkoutUUID
  make_request_put(proxy, url, headers, payload, session, (body) => {
    if (body.status === undefined) {
      console.log("3/4 checkout (error 614)");
    } else {
      console.log("Checkout 3/4")
      co4()
    }

  })
}

function co4() {
  headers = {
    "authority": "api.nike.com",
    "method": "GET",
    "path": "/buy/checkout_previews/v2/jobs/" + checkoutUUID,
    "scheme": "https",
    "accept": "application/json",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-type": "application/json; charset=UTF-8",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-caller-id": "nike:sneakrs:ios:1.1",
  }
  url = "https://api.nike.com/buy/checkout_previews/v2/jobs/" + checkoutUUID
  make_request_get(proxy, url, headers, payload, session, (body) => {

    let decoded_data = body.toString('utf8');
    console.log(decoded_data, body);
    if (body.status === undefined) {
      console.log("4/4 checkout (error 614)");
    } else {
      if (body.status == "COMPLETED") {
        console.log("Checkout 4/4 -  Status : " + body.status)
        global.PCS = body.response.priceChecksum
        userCheck()
      } else {
        console.log("Checkout 4/4 - Status : " + body.status)
      }

    }

  })

}

function userCheck() {
  headers = {
    "authority": "api.nike.com",
    "method": "POST",
    "path": "/userCheck",
    "scheme": "https",
    "accept": "*/*",
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-type": "application/json",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-ux-id": "com.nike.commerce.snkrs.v2.ios",
  }
  payload = {
    "password": profile.password
  }
  url = "https://api.nike.com/userCheck"
  make_request_post(proxy, url, headers, payload, session, (body) => {
    global.upmId = body.upmId;
    retrievePayMethods()

  })


}




function retrievePayMethods() {
  headers = {
    "authority": "api.nike.com",
    "method": "POST",
    "path": "/commerce/storedpayments/consumer/storedpayments?currency=EUR&includeBalance=true",
    "scheme": "https",
    "accept": "*/*",
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-locale": "fr_FR",
    "content-type": "application/json",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-caller-id": "nike:sneakrs:ios:1.1",
  }
  payload = {}
  url = "https://api.nike.com/commerce/storedpayments/consumer/storedpayments"
  make_request_post(proxy, url, headers, payload, session, (body) => {
    try {
      console.log(body);
      let payment = body.payments
      let PIDpaymentID = payment[0].paymentId
      console.log("paymen method fetched");
      global.PIDpaymentID = PIDpaymentID


    } catch (e) {
      console.log("No payement method found" + e.message);
    }
    pay1()
  })
}









function pay1() {
  headers = {
    "authority": "api.nike.com",
    "method": "POST",
    "path": "/payment/preview/v2",
    "scheme": "https",
    "accept": "application/json; charset=utf-8",
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-type": "application/json",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-caller-id": "nike:sneakrs:ios:1.1",
  }
  payload = {
    "total": total,
    "items": [{
      "productId": item_info.item_uuid,
      "shippingAddress": {
        "city": profile['city'],
        "address1": profile['address'],
        "postalCode": profile['postalCode'],
        "country": "FR"
      }
    }],
    "checkoutId": checkoutUUID,
    "currency": "EUR",
    "paymentInfo": [{
      "id": PIDpaymentID,
      "cardType": "MasterCard",
      "accountNumber": "XXXXXXXXXXXX" + payment_info['accountNumber'].substring(0, payment_info['accountNumber'].length - 4),
      //"creditCardInfoId": CC_UUID,
      "type": "CreditCard",
      "paymentId": PIDpaymentID,
      "billingInfo": {
        "name": {
          "lastName": profile['lname'],
          "firstName": profile['fname']
        },
        "contactInfo": {
          "phoneNumber": profile['phone'],
          "email": profile['email']
        },
        "address": {
          "city": profile['city'],
          "address1": profile['address'],
          "postalCode": profile['zip'],
          "country": "FR"
        }
      }
    }],
    "country": "FR"
  }
  url = "https://api.nike.com/payment/preview/v2"
  make_request_post(proxy, url, headers, payload, session, (body) => {
    console.log("Payement 1/4, STATUS : ", body.status);
    global.paymentUUID = body.id
    pay2()

  })

}


function pay2() {
  headers = {
    "authority": "api.nike.com",
    "method": "GET",
    "path": "/payment/preview/v2/jobs/" + paymentUUID,
    "scheme": "https",
    "accept": "application/json; charset=utf-8",
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-type": "application/json; charset=UTF-8",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-caller-id": "nike:sneakrs:ios:1.1",
  }
  payload = {}
  url = "https://api.nike.com/payment/preview/v2/jobs/" + paymentUUID
  make_request_get(proxy, url, headers, payload, session, (body) => {
    console.log("Payment 2/2, STATUS", body.status);
    getLaunchID()

  })

}

function getLaunchID() {
  url = "https://api.nike.com/launch/launch_views/v2?filter=productId(" + item_info.item_uuid + ")"
  make_request_get(proxy, url, headers, payload, session, (body) => {
    global.launchId = body.objects[0].id
    console.log("LaunchID : " + launchId);

  })
}

function entry1() {
  headers = {
    "authority": "api.nike.com",
    "method": "POST",
    "path": "/launch/entries/v2",
    "scheme": "https",
    "accept": "*/*",
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
    "accept-language": "fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
    "Authorization": "Bearer " + access_token,
    "content-type": "application/json",
    "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
    "x-nike-caller-id": "nike:sneakrs:ios:1.1",
  }
  payload = {
    "checkoutId": checkoutUUID,
    "currency": "EUR",
    "paymentToken": paymentUUID,
    "shipping": {
      "recipient": {
        "lastName": profile['lname'],
        "firstName": profile['fname'],
        "email": profile['email'],
        "phoneNumber": profile['phone']
      },
      "method": "GROUND_SERVICE",
      "address": {
        "city": profile['city'],
        "address1": profile['address'],
        "postalCode": profile['zip'],
        "country": "FR"
      }
    },
    "skuId": sku_uuid,
    "channel": "SNKRS",
    "launchId": launchId,
    "locale": "fr_FR",
    "priceChecksum": priceChecksum,
  }
  url = 'https://api.nike.com/launch/entries/v2'
  make_request_post(proxy, url, headers, payload, session, (body) => {
    let entryId = body.id
    console.log("Entry 1/2", entryId);
  })

}








global.proxy = {
  domain: "lunar.astroproxies.com",
  "port": "7777",
  "username": "customer-astro_4198358-cc-fr-sessid-PTHnYsMiKYqW",
  password: "bdc984c262"
}
global.access_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFlYmJkMWMyLTNjNDUtNDM5NS04MGMzLWE3YTIyMmJlOTJmMHNpZyJ9.eyJ0cnVzdCI6MTAwLCJpYXQiOjE1OTUxNzE3NzcsImV4cCI6MTU5NTE3NTM3NywiaXNzIjoib2F1dGgyYWNjIiwianRpIjoiY2U3MDFiYmEtMWRmMy00ZWUxLTgxNDAtNWNlZDg2MjA5MTAyIiwibGF0IjoxNTk1MDc1NDQyLCJhdWQiOiJjb20ubmlrZS5kaWdpdGFsIiwic3ViIjoiY29tLm5pa2UuY29tbWVyY2UubmlrZWRvdGNvbS53ZWIiLCJzYnQiOiJuaWtlOmFwcCIsInNjcCI6WyJuaWtlLmRpZ2l0YWwiXSwicHJuIjoiYzgyOGFmOWItZWI2Mi00N2VhLThlNWMtYWNlZWY2NDAxZDFmIiwicHJ0IjoibmlrZTpwbHVzIn0.ZKEXzb3GnknPbW3DLyPLSjRhzIwF7KaOqXT4B462K1oatz3o-o7q39-uXreoow1KcBPdelopjFzoiOpM4QYI8d23aziHlQ9LwgpH4Qi0ubBjQI_5g5qQ-J9uWPgxyGjD42HKyZvdywHEiYVhLS3xuH5XEltuy-3fHaw7GD2XH5D6PcxLDW-tusKdrdw1E3as3FeQzTJDU_9D43idZ1d9cCa8qFzB9fqj07C2XHobUMirnWaJhXup0MTIRASG7I27Sn_QWEUNKfIn2A52ystydRpc8Al80JWHORk1AMRgxF8XN2GLnVBqsfXnFHcg6_A3-vHvl1ZnJsQb9dvsv03adA"

global.item_info = {
  item_uuid: "83f9273c-6c58-53f6-a6b4-5b0301698abb",
  sku_uuid: "0d434158-3f0e-5346-acc6-26ed801e0943"
}

global.profile = {
  'zip': "38190",
  'address': "Le sausey",
  'city': "LAVAL",
  'phone': "0769933717",
  'lname': "MATHIAN",
  'fname': "Thibault",
  'email': "titanmath.t@gmail.com",
  'password': "jslRdl4!"
}

global.payment_info = {
  "cvNumber": "104",
  "accountNumber": "4596640018475017",
  "expirationYear": "2024",
  "cardType": "Visa", // ? mastercard visa etc? check SNKRS
  "expirationMonth": "12"
}


global.session = request.jar()

global.total = 100

co1()
console.log('fin fin');
