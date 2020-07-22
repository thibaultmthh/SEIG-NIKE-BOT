import get_info
import requests
import json
import os
import time
import random
import datetime
import sys
import uuid
from requests.packages import urllib3
from tabulate import tabulate
urllib3.disable_warnings()


print("ok")


def log(event):
    d = datetime.datetime.now().strftime("%H:%M:%S")
    print("Nike by Azerpas :: " + str(d) + " :: " + event)


user_id = None
access_token = None
PIDpaymentID = None
CC_UUID = None
PCS = None


def getLaunchID(session, proxy, productUUID):
	# https://api.nike.com/launch/launch_views/v2?filter=productId(a06463c7-6c62-5b83-b79f-1c69f5d34e73,be2f17fc-c629-5785-b100-d4cb60278a01,dcc140b0-80ec-5ab2-9ce9-9afa508d898f,0b2410ac-bb99-5330-85dd-18c014474325,d00f855a-c41f-59fc-93b3-690a1857a844,61df791a-b1d7-57c1-a4f6-3bae510ed413,038ee55e-680e-5448-9c12-e4ac93c5ff37,7cb3d5ad-0900-5102-9273-be34312071b3,d303a2d8-547c-508b-94cc-10428e43a32e,b87d3475-ebd3-566d-9aad-6406c11e27a7,e28c6605-09d8-52bc-9b71-34a9d881d61e,b9a97705-5977-5653-b7d7-8292ec603fa0,2b48a9d9-e4cf-579c-8fb9-988e5138b401,1984c803-669c-5b43-9d5d-97c95a137351,01f0c4be-5cfb-56ce-89f3-ea4c6d42ebe8,e453d1e1-d448-5779-bb68-646bb328b4d4,fc65eafd-b440-5bd0-b8ab-9e616304a26d,0febc47a-9aea-50f2-bff7-c78e6727d980,55f2ff6b-2258-5141-8e49-921cc8033431,7d993144-13a6-5cb3-bdfb-f59604e39e58,a49e09e4-de08-52c6-8739-eb8bf5ab7a9d,5c007699-b81c-5f1c-845d-9080b1590184)
	global access_token
	global user_id

	launch_url = "https://api.nike.com/launch/launch_views/v2?filter=productId(" + \
	                                                                           productUUID + ")"
	a = session.get(launch_url, verify=False)
	decoded_resp = json.loads(a.text, encoding="utf-8")
	return decoded_resp['objects'][0]['id']


def accountInfos(session, proxy):
    """fonctionell"""
    global access_token
    global user_id
    infos_url = "https://api.nike.com/user/commerce"
    headers = {
        "method": "GET",
        "scheme": "https",
        "path": "/user/commerce",
        "authority": "api.nike.com",
        "Authorization": "Bearer " + access_token,
        "content-type": "application/json",
        "accept": "*/*",
        "x-nike-ux-id": "com.nike.commerce.snkrs.v2.ios",
        "user-agent": "SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
        "x-requested-with": "XMLHttpRequest",
    }
    try:
        a = session.get(infos_url, verify=False, headers=headers)
    except Exception as e:
        log("Canno't connect, means you're banned or your internet isn't working")
        raise e
    if(a.status_code == 200):
        log("Successfully scraped user infos")
    else:
        log("Canno't scrape user infos, please check the password, identification might failed")
        print(a.text)
        raise ValueError("Canno't scrape user infos (error 101)")
    decoded_resp = json.loads(a.text)
    try:
        phoneNumber = decoded_resp['verifiedphone']
        phoneCountry = decoded_resp['verifiedPhoneCountry']
        # just as infos for user
        log("Verified phone number for this account: " +
            str(phoneNumber) + " : " + str(phoneCountry))
    except Exception as e:
        log("Canno't scrape verified phone neither country, it probably means that this account is not verified, please check the error below")
        print(e)
    try:
        nuId = decoded_resp['nuId']
        upmId = decoded_resp['upmId']
        # both will be used when checking out
        log("Account infos: " + nuId + " - " + upmId)
    except Exception as e:
        log("Canno't scrape nuId or upmId, it probably means that the login didn't work, please check the error below and retry")
        exit(0)


def retrievePayMethods(session, proxy, profile):
    """fonctionell"""
    global access_token
    global user_id
    global PIDpaymentID

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
    a = session.post('https://api.nike.com/commerce/storedpayments/consumer/storedpayments?currency=EUR&includeBalance=true',
                     verify=False, headers=headers, json={})
    if(a.status_code == 200):
        log("Retrieved payment methods successfully")
        print(a.text)
    else:
        log("Canno't retrieve payment methods")
        print(a.text)
        raise ValueError("Canno't retrieve payment methods")
    try:
        payments = json.loads(a.text)['payments']
        PIDpaymentID = json.loads(a.text)['payments'][0]['paymentId']
        log("PaymentID retrieved")
        return payments
    except Exception as e:
        log("No payment methods found")
        print(e)


def co1(session, proxy, total, item_uuid):
    global access_token
    global user_id

    '''
    x-b3-traceid    7845535027403799357
    x-newrelic-id    VQYGVF5SCBAEVVBUBgMDVg==
    '''
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
        "items": [item_uuid],
        "billingCountry": "FR",
        "currency": "EUR",
        "country": "FR"
    }

    a = session.post('https://api.nike.com/payment/options/v2',
                     verify=False, headers=headers, json=payload)
    print(a.text)
    if(a.status_code == 200):
        log("Checkout 1/4")
        # print(a.text)
    else:
        log("Problem while trying to pass 1/4 checkout phase")
        print(a.text)
        raise ValueError("1/4 checkout (error 612)")
    try:
        paymentsOptions = json.loads(a.text)['paymentOptions']
    except Exception as e:
        log("No payment options found")
        print(e)


def co2(session, proxy, item_uuid, sku_uuid, profile):
    global access_token
    global user_id

    '''
	x-b3-traceid	3740821007608208046
	x-newrelic-id	VQYGVF5SCBAEVVBUBgMDVg==
	'''

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

    shippingUUID = str(uuid.uuid4())

    payload = {
        "items": [{
            "id": shippingUUID,
            "shippingAddress": {
                "postalCode": profile['zip'],
                "address1": profile['address'],
                "city": profile['city'],
                "country": "FR"
            },
            "skuId": sku_uuid
        }],
        "currency": "EUR",
        "country": "FR"
    }

    a = session.post('https://api.nike.com/buy/shipping_options/v2',
                     verify=False, headers=headers, json=payload)
    if(a.status_code == 200):
        log("Checkout 2/4")
        # print(a.text)
    else:
        log("Problem while trying to pass 2/4 checkout phase")
        print(a.text)
        raise ValueError("2/4 checkout (error 613)")
    try:
        items = json.loads(a.text)['items']
        return shippingUUID
    except Exception as e:
        log("Shipping options canno't be submit")
        print(e)


def co3(session, proxy, sku_uuid, profile, shippingUUID, deviceId):
	global access_token
	global user_id

	checkoutUUID = str(uuid.uuid4())

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
			"email": profile['email'],
			"clientInfo": {
				# "deviceId": deviceId,
				"client": "com.nike.commerce.snkrs.v2.ios"
			},
			"currency": "EUR",  # todo
			"items": [{
				"recipient": {
					"lastName": profile['lname'],
					"firstName": profile['fname']
				},
				"shippingAddress": {
					"city": profile['city'],
					"address1": profile['address'],
					"postalCode": profile['zip'],
					"country": "FR"
				},
				"id": shippingUUID,
				"quantity": 1,
				"skuId": sku_uuid,
				"shippingMethod": "GROUND_SERVICE",
				"contactInfo": {
					"phoneNumber": profile['phone'],
					"email": profile['email']
				}
			}],
			"channel": "SNKRS",
			"locale": "fr_FR",
			"country": "FR"
		}
	}

	a = session.put('https://api.nike.com/buy/checkout_previews/v2/' +
	                checkoutUUID, verify=False, headers=headers, json=payload)
	if(a.status_code == 202):
		log("Checkout 3/4")
		# print(a.text)
	else:
		log("Problem while trying to pass 3/4 checkout phase")
		print(a.text)
		raise ValueError("3/4 checkout (error 614)")
	try:
		status = json.loads(a.text)['status']
		log("Status: " + status)
		return checkoutUUID
	except Exception as e:
		log("Checkout preview canno't be submit")
		print(e)


def co4(session, proxy, checkoutUUID):
	global access_token
	global user_id
	global PCS

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

	checkout_url = "https://api.nike.com/buy/checkout_previews/v2/jobs/" + checkoutUUID
	a = session.get(checkout_url, verify=False, headers=headers)
	# print(a)
	print("chelouc quand meme")
	print(a.text, "textmlksqmlkdjsmqldkjf")
	print("chelouc quand meme")
	decoded_resp = json.loads(a.text)
	print(decoded_resp)
	try:
		status = decoded_resp['status']
	except:
		return False
	if(status=="COMPLETED"):
		PCS = decoded_resp['response']['priceChecksum']
		return True
	else:
		return False

def userCheck(session,proxy,password):
	global access_token
	global user_id
	headers = {
		"authority":"api.nike.com",
		"method":"POST",
		"path":"/userCheck",
		"scheme":"https",
		"accept":"*/*",
		"accept-encoding":"gzip;q=1.0, compress;q=0.5",
		"accept-language":"fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
		"Authorization":"Bearer "+access_token,
		"content-type":"application/json",
		"user-agent":"SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
		"x-nike-ux-id":"com.nike.commerce.snkrs.v2.ios",
	}

	payload = {
	"password": password
	}

	a = session.post("https://api.nike.com/userCheck",verify=False,headers=headers,json=payload)
	if(a.status_code == 200):
		log("User checked successfully")
		# print(a.text)
	else:
		log("Can't check user")
		print(a.text)
		raise ValueError("Can't check user (error 344)")
	try:
		nuId = json.loads(a.text)['nuId']
		upmId = json.loads(a.text)['upmId']
	except Exception as e:
		log("Can't retrieve nuId or upmId")
		print(e)

def pay1(session,proxy,total,item_uuid,profile,checkoutId):#,paymentInfo):
	global user_id
	global access_token

	headers = {
		"authority":"api.nike.com",
		"method":"POST",
		"path":"/payment/preview/v2",
		"scheme":"https",
		"accept":"application/json; charset=utf-8",
		"accept-encoding":"gzip;q=1.0, compress;q=0.5",
		"accept-language":"fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
		"Authorization":"Bearer "+access_token,
		"content-type":"application/json",
		"user-agent":"SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
		"x-nike-caller-id":"nike:sneakrs:ios:1.1",
	}

	payload = {
	"total": total,
	"items": [{
		"productId": item_uuid,
		"shippingAddress": {
			"city": profile['city'],
			"address1": profile['address'],
			"postalCode": profile['zip'],
			"country": "FR" #todo18
		}
	}],
	"checkoutId": checkoutId,
	"currency": "EUR",
	"paymentInfo": [{
		"id": PIDpaymentID,
		"cardType": "MasterCard",
		"accountNumber": "XXXXXXXXXXXX"+paymentInfo['accountNumber'][-4:],
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

	a = session.post('https://api.nike.com/payment/preview/v2',verify=False,headers=headers,json=payload)
	if(a.status_code == 202):
		log("Payment 1/2")
		print(a.text)
	else:
		log("Problem while trying to pass 1/2 payment phase")
		print(a.text)
		raise ValueError("1/2 payment (error 615)")
	try:
		status = json.loads(a.text)['status']
		paymentID = json.loads(a.text)['id']
		log("Status: " + status)
		log("Payment: " + paymentID)
		return paymentID
	except Exception as e:
		log("Payment preview canno't be submit")
		print(e)

def pay2(session,proxy,paymentUUID):
	global access_token
	global user_id

	headers = {
		"authority":"api.nike.com",
		"method":"GET",
		"path":"/payment/preview/v2/jobs/"+paymentUUID,
		"scheme":"https",
		"accept":"application/json; charset=utf-8",
		"accept-encoding":"gzip;q=1.0, compress;q=0.5",
		"accept-language":"fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
		"Authorization":"Bearer "+access_token,
		"content-type":"application/json; charset=UTF-8",
		"user-agent":"SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
		"x-nike-caller-id":"nike:sneakrs:ios:1.1",
	}


	# checkout_url = "https://api.nike.com/payment/preview/v2/jobs/"+checkoutUUID
	a = session.get("https://api.nike.com/payment/preview/v2/jobs/"+paymentUUID,verify=False, headers=headers)
	print(a)
	print(a.text)
	decoded_resp = json.loads(a.text)
	try:
		status = decoded_resp['status']
	except:
		return False
	if(status=="COMPLETED"):
		return True
	else:
		return False



def basic_entry(session, proxy, profile, checkoutUUID, paymentUUID, sku_uuid, priceChecksum, launchID):
	pass


def entry1(session,proxy,profile,checkoutUUID,paymentUUID,sku_uuid,priceChecksum,launchId):
	global access_token
	global user_id

	headers = {
		"authority":"api.nike.com",
		"method":"POST",
		"path":"/launch/entries/v2",
		"scheme":"https",
		"accept":"*/*",
		"accept-encoding":"gzip;q=1.0, compress;q=0.5",
		"accept-language":"fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
		"Authorization":"Bearer "+access_token,
		"content-type":"application/json",
		"user-agent":"SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
		"x-nike-caller-id":"nike:sneakrs:ios:1.1",
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
	"skuId": sku_uuid,# "df9a23e7-a549-5cb4-91a2-fca03224de28",
	"channel": "SNKRS",
	"launchId": launchId, # "acedd90d-a7fd-449b-a1fa-149abeade37e",
	"locale": "fr_FR",
	"priceChecksum": PCS, #"5492053f735d2ea35dcb6a1f10eca05c"
	}


	a = session.post('https://api.nike.com/launch/entries/v2',verify=False,headers=headers,json=payload)
	if(a.status_code == 201):
		log("Entry 1/2")
		print(a.text)
	else:
		log("Problem while trying to pass 1/2 entry phase")
		print(a.text)
		raise ValueError("1/2 entry (error 715)")
	try:
		entryId = json.loads(a.text)['id']
		log("entryId: " + entryId)
		return entryId
	except Exception as e:
		log("Entry canno't be submit")
		print(e)


def entry2(session,proxy,entryUUID):
	global access_token
	# "estimatedResultAvailability": "2018-03-26T08:03:03.000Z",

	'''
	"result": {
		"checkoutId": "bb4b5731-1935-4785-b208-65f38e9988d7",
		"status": "NON_WINNER",
		"reason": "OUT_OF_STOCK",
		"reentryPermitted": true
	},
	'''

	headers = {
		"authority":"api.nike.com",
		"method":"GET",
		"path":"/launch/entries/v2/"+entryUUID,
		"scheme":"https",
		"accept":"*/*",
		"accept-encoding":"gzip;q=1.0, compress;q=0.5",
		"accept-language":"fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
		"Authorization":"Bearer "+access_token,
		"content-type":"application/json",
		"user-agent":"SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
		"x-nike-caller-id":"nike:sneakrs:ios:1.1",
	}

	a = session.get("https://api.nike.com/launch/entries/v2/"+entryUUID,verify=False, headers=headers)
	print(a)
	print(a.text)
	decoded_resp = json.loads(a.text)
	try:
		time = decoded_resp['estimatedResultAvailability']
		time = time.split("T")[1]
		time = time.split(":")
		resultH = time[0]
		resultM = time[1]
		resultS = time[2][:2]
		log("Waiting for result till: " + str(resultH) + ":" + str(resultM) + ":" + str(resultS))
		schedule((int(resultH)-2),int(resultM),int(resultS))
		return 'wait'
		# transformer les valeurs en Int et ajouter scheduler puis entry2()
		# schedule(int(resultH),int(resultM),int(resultS))
	except:
		try:
			drawResult = decoded_resp['result']['status'] ####???????????
			log("Result: "+drawResult)
			return drawResult
		except:
			log("Can't fetch result")
			print(decoded_resp)
			return 'looser'


def entry2(session,proxy,entryUUID):
	global access_token
	#"estimatedResultAvailability": "2018-03-26T08:03:03.000Z",

	'''
	"result": {
		"checkoutId": "bb4b5731-1935-4785-b208-65f38e9988d7",
		"status": "NON_WINNER",
		"reason": "OUT_OF_STOCK",
		"reentryPermitted": true
	},
	'''

	headers = {
		"authority":"api.nike.com",
		"method":"GET",
		"path":"/launch/entries/v2/"+entryUUID,
		"scheme":"https",
		"accept":"*/*",
		"accept-encoding":"gzip;q=1.0, compress;q=0.5",
		"accept-language":"fr-FR;q=1.0, en-US;q=0.9, zh-Hans-FR;q=0.8",
		"Authorization":"Bearer "+access_token,
		"content-type":"application/json",
		"user-agent":"SNEAKRS/1.1.3 (iPhone; iOS 11.2.2; Scale/3.00)",
		"x-nike-caller-id":"nike:sneakrs:ios:1.1",
	}

	a = session.get("https://api.nike.com/launch/entries/v2/"+entryUUID,verify=False, headers=headers)
	print(a)
	print(a.text)
	decoded_resp = json.loads(a.text)
	try:
		time = decoded_resp['estimatedResultAvailability']
		time = time.split("T")[1]
		time = time.split(":")
		resultH = time[0]
		resultM = time[1]
		resultS = time[2][:2]
		log("Waiting for result till: " + str(resultH) + ":" + str(resultM) + ":" + str(resultS))
		schedule((int(resultH)-2),int(resultM),int(resultS))
		return 'wait'
		# transformer les valeurs en Int et ajouter scheduler puis entry2()
		# schedule(int(resultH),int(resultM),int(resultS))
	except:
		try:
			drawResult = decoded_resp['result']['status'] ####???????????
			log("Result: "+drawResult)
			return drawResult
		except:
			log("Can't fetch result")
			print(decoded_resp)
			return 'looser'


def make_entry(proxy, identifiants,item_uuid, skuUUID, price, PIDpaymentID, profile):
    s = requests.session()

    co1(s, proxy, price, item_uuid)
    shippingUUID= co2(s, proxy, item_uuid, skuUUID, profile)
    checkoutUUID = co3(s, proxy, skuUUID, profile, shippingUUID, "")
    status = co4(s, proxy, checkoutUUID)

    userCheck(s, proxy, identifiants["password"])

    paymentUUID = pay1(s,proxy,price,item_uuid,profile,checkoutUUID)#,paymentInfo) #item_uuid profile paymentInfo

    status2 = pay2(s,proxy,paymentUUID)
    launchID = getLaunchID(s, proxy, item_uuid)

    entryUUID = entry1(s,proxy,profile,checkoutUUID,paymentUUID,skuUUID,PCS,launchID) # sku uuid launchid pricecheksum
    return entryUUID


def getAllCalendar(session,proxy):
	"""modifier et fonctionell"""
	# "https://api.nike.com/commerce/productfeed/products/snkrs/threads?country=FR&lastUpdatedAfter=2018-03-25-00-00&limit=50&locale=fr_FR&skip=0&withCards=true"
	url_ex = "https://api.nike.com/product_feed/threads/v2/?filter=marketplace%28FR%29&filter=language%28fr%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29"

	today = datetime.datetime.now().strftime("%Y-%m-%d-00-00")
	# calendar_url = "https://api.nike.com/commerce/productfeed/products/snkrs/threads?country=FR&lastUpdatedAfter=" + today + "&limit=50&locale=fr_FR&skip=0&withCards=true"
	calendar_url = url_ex

	a = session.get(calendar_url,verify=False)
	decoded_resp = json.loads(a.text,encoding="utf-8")
	# you can do whatever you want with this
	return decoded_resp





s = requests.session()
proxy = {'https': ''}
identifiants = {"email": "bastiOne@gmx.de", "password": "Schuhe123#"}
user_id = "2f267c4e-5e59-4c9e-b9df-a244a8ed2819"
paymethods = retrievePayMethods(s, proxy, {})
profile = {'zip': "38190", 'address': "Le sausey", 'city': "LAVAL", 'phone': "0769933717",'lname': "MATHIAN", 'fname': "Thibault", 'email': "titanmath.t@gmail.com", 'password': "jslRdl4!"}


paymentInfo = {
	"cvNumber": "249",
	"accountNumber": "53558618838818404",
	"expirationYear": "2025",
	"cardType": "MASTERCARD", # ? mastercard visa etc? check SNKRS
	"expirationMonth": "04"}
access_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFlYmJkMWMyLTNjNDUtNDM5NS04MGMzLWE3YTIyMmJlOTJmMHNpZyJ9.eyJ0cnVzdCI6MTAwLCJpYXQiOjE1OTI5ODI1ODYsImV4cCI6MTU5Mjk4NjE4NiwiaXNzIjoib2F1dGgyYWNjIiwianRpIjoiMzliOWE1ZWMtNGM5OS00Y2ExLWI2YjctYzFhNDkxOGE0NjdlIiwibGF0IjoxNTkyOTQxODI5LCJhdWQiOiJjb20ubmlrZS5kaWdpdGFsIiwic3ViIjoiY29tLm5pa2UuY29tbWVyY2UubmlrZWRvdGNvbS53ZWIiLCJzYnQiOiJuaWtlOmFwcCIsInNjcCI6WyJuaWtlLmRpZ2l0YWwiXSwicHJuIjoiMmYyNjdjNGUtNWU1OS00YzllLWI5ZGYtYTI0NGE4ZWQyODE5IiwicHJ0IjoibmlrZTpwbHVzIn0.NwccHFy5ab6TFfRPjBodxVV-8-dFVhKVAY3XhtrQjT4W9pLwtxUx6gFgMsmiPBnO2A36_wyLRDgIpr7moVy6gAWMPgESwZIbNCgSeBckcTzqBxwrd85AYJuTwwJaii8NpVc45K1krauyEGZv6U-M9cY-Xkkt6snSB0EnMPZJkz3XeuexNGXDTBQJKxZeTTWvttOPwkCF-h1jqUDWtdfHvd2Yqc5oarskvAXkUrrCcbtdxEWGDDRFC_krW9w1RIRhsU8mrfa1ZZX5VYmkChCPcOHBMXjfaxfkprrnZFin4zg6DegcVteox88ZHstBZYTFpyUQThyTF-W-L2iggnPFtQ"



item_uuid = "86178f3f-4b86-5c2f-b41f-5545d5e2c536"
skuUUID = "6c9f745b-b193-54f4-bb15-d0b6e9a78515"
total, retail = 100, 100


c = getAllCalendar(s, proxy)
print(c)
i = get_info.get_pairs_info(c["objects"])

accountInfos(s, proxy)


'5dbaf75e-86db-541e-9f32-afdefe895947'

entry2(s, proxy, '5dbaf75e-86db-541e-9f32-afdefe895947')


#entryUUID = make_entry(proxy,identifiants, item_uuid,skuUUID,175, "pid46033d51-b777-442c-bf92-3f9384e05f68",profile)
