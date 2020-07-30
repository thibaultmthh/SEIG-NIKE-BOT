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
    if (res.statusCode != 200) {
      console.log(res.statusCode);
      return
    }
    rcallback(body)
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
    "accept-encoding": "gzip;q=1.0, compress;q=0.5",
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
    console.log(JSON.parse(decoded_data))
    if (body.status === undefined) {
      console.log("4/4 checkout (error 614)");
    } else {
      if (body.status == "COMPLETED") {
        console.log("Checkout 4/4 -  Status : " + body.status)
        global.PCS = body.response.priceChecksum
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
  make_request_post(proxy, url, headers, payload, session, (body) => {
    global.upmId = body.upmId;

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
      "productId": item_uuid,
      "shippingAddress": {
        "city": profile['city'],
        "address1": profile['address'],
        "postalCode": profile['postalCode'],
        "country": "FR"#
        todo18
      }
    }],
    "checkoutId": checkoutId,
    "currency": "EUR",
    "paymentInfo": [{
      "id": PIDpaymentID,
      "cardType": "MasterCard",
      "accountNumber": "XXXXXXXXXXXX" + paymentInfo['accountNumber'][-4: ],
      "creditCardInfoId": CC_UUID,
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

}









global.proxy = {
  domain: "lunar.astroproxies.com",
  "port": "7777",
  "username": "customer-astro_4198358-cc-fr-sessid-PTHnYsMiKYqW",
  password: "bdc984c262"
}
global.access_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFlYmJkMWMyLTNjNDUtNDM5NS04MGMzLWE3YTIyMmJlOTJmMHNpZyJ9.eyJ0cnVzdCI6MTAwLCJpYXQiOjE1OTMxMTI2ODgsImV4cCI6MTU5MzExNjI4OCwiaXNzIjoib2F1dGgyYWNjIiwianRpIjoiY2E1ZDQ2NTktMjYzMC00Y2NkLWI4ODgtNmY0MDI3ZDM1ZDY1IiwibGF0IjoxNTkzMTEyNjg4LCJhdWQiOiJjb20ubmlrZS5kaWdpdGFsIiwic3ViIjoiY29tLm5pa2UuY29tbWVyY2Uuc25rcnMud2ViIiwic2J0IjoibmlrZTphcHAiLCJzY3AiOlsiY29tbWVyY2UiXSwicHJuIjoiMmYyNjdjNGUtNWU1OS00YzllLWI5ZGYtYTI0NGE4ZWQyODE5IiwicHJ0IjoibmlrZTpwbHVzIn0.srex24sKhASrFPeNscxZ9I_ZByqzN5AvfJ1fiI6E1_QeBSZtaJe-hC1e2dRvgJqag5hAg3lB7UeCep_aDBqeE_6XjPuKgOL8kvKRf75qgCZao0Mp946irh7jeBwIIZlDyDT6MH94MO2hICU93JbPhg09oMH07nY3PGycKj8HxJOQPURZm9Ue9JoiV2lrI2WV5RWVqvv0Qy451cChrtZ5a8ZtIJanp2DpYD_cJzlXbV8MjsqiaN5NvtFA8JuZ9dY4XdW-h6tHehuvpg4jXl2qAGuD0ipVodYXC2VcZf3YZl3P1r5gqXW88oOn1l94bcmTE4MHJyn48t1snyoTPAe41w"

global.item_info = {
  item_uuid: "edc3c986-8fe8-5f12-a213-d7d545e83f7f",
  sku_uuid: "fcb9eefa-6c19-5dd8-bf67-a8f271b65f84"
}

global.profile = {
  'zip': "38190",
  'address': "Le sausey",
  'city': "LAVAL",
  'phone': "0769933717",
  'lname': "MATHIAN",
  'fname': "Thibault",
  'email': "titanmath.t@gmail.com",
  'password': "4ZqRsl4"
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
