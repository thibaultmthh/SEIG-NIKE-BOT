import datetime
import json



def getCalendar(session,proxy):
	"""modifier et fonctionell"""
	#"https://api.nike.com/commerce/productfeed/products/snkrs/threads?country=FR&lastUpdatedAfter=2018-03-25-00-00&limit=50&locale=fr_FR&skip=0&withCards=true"
	url_ex = "https://api.nike.com/product_feed/threads/v2/?filter=marketplace%28FR%29&filter=upcoming%28true%29&filter=language%28fr%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29"

	today = datetime.datetime.now().strftime("%Y-%m-%d-00-00")
	#calendar_url = "https://api.nike.com/commerce/productfeed/products/snkrs/threads?country=FR&lastUpdatedAfter=" + today + "&limit=50&locale=fr_FR&skip=0&withCards=true"
	calendar_url = url_ex

	a = session.get(calendar_url,verify=False)
	decoded_resp = json.loads(a.text,encoding="utf-8")
	# you can do whatever you want with this
	return decoded_resp

def get_all_pair_sizes(pair):
	"""fonctionell"""
	skus = pair["productInfo"][0]["skus"]
	sizes_list = {}
	for sizes in skus:
		sizes_list[sizes["nikeSize"]] = sizes["id"]
	return sizes_list


def get_pairs_info(pairs):
	"""fonctionell"""
	all_pairs_info = []
	for pair in pairs:
		print("")
		print("-------")
		pair_info = {}
		try:
			name = pair["productInfo"][0]["productContent"]["title"]
			print("Name : " + name)
			pair_info["name"] = name
		except:
			pair_info["name"] = ""

		try:
			price = pair["productInfo"][0]["merchPrice"]["currentPrice"]
			print("Price : ", price ,"€")
			pair_info["price"] = price
		except:
			pair_info["price"] = ""

		try:
			entry_date = pair["productInfo"][0]["launchView"]["startEntryDate"]
			print("Start at :", entry_date)
			pair_info["entry_date"] = entry_date
		except:
			pair_info["entry_date"] = ""
		try:
			method = pair["productInfo"][0]["launchView"]["method"]
			print("method :", method)
			pair_info["method"] = method
		except:
			pair_info["method"] = ""

		try:
			size_list = get_all_pair_sizes(pair)
			print("Avaliables sizes :", ", ".join(list(size_list.keys())))
			pair_info["size_list"] = size_list
		except:
			pair_info["size_list"] = ""

		try:
			pair_id = pair["productInfo"][0]["merchProduct"]["id"]
			pair_info["pair_id"] = pair_id
		except:
			pair_info["pair_id"] = ""

		try:
			genders = pair["productInfo"][0]["merchProduct"]["genders"]
			print("gender :", ", ".join(genders))
			pair_info["genders"] = genders
		except:
			pair_info["genders"] = ""

		try:
			print("Publish type : ", pair["productInfo"][0]["merchProduct"]["publishType"])
		except:
			pass

		all_pairs_info.append(pair_info)
	return all_pairs_info
