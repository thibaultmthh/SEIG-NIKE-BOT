const request = require("request")



var region_info = {
  "French": {
    "language": "fr",
    "marketplace": "FR"
  },
  "United_States": {
    "language": "en",
    "marketplace": "US"
  },
  "New_Zealand": {
    "language": "en-GB",
    "marketplace": "NZ"
  },
  "Taiwan": {
    "language": "zh-Hant",
    "marketplace": "TW"
  },
  "China": {
    "language": "zh-Hans",
    "marketplace": "CN"

  }
}







function get_pair_size(pair) {
  let skus = pair.productInfo[0].skus
  let sizes_list = []
  for (var i in skus) {
    let sku = skus[i]
    sizes_list.push({
      size: sku.nikeSize,
      id: sku.id
    })

  }
  return sizes_list

}


function get_pairs_info(pairs) {

  for (var i in pairs) {
    pair = pairs[i]
    pair_info = {}

    try {
      pair_info.name = pair.productInfo[0].productContent.title
      pair_info.price = pair.productInfo[0].merchPrice.currentPrice
      pair_info.size_list = get_pair_size(pair)
      pair_info.pair_id = pair.productInfo[0].merchProduct.id
      
      pair_info.genders = pair.productInfo[0].merchProduct.genders
      pair_info.photo = pair.productInfo[0].imageUrls.productImageUrl
      pair_info.method = pair.productInfo[0].launchView.method

      pair_info.entry_date = pair.productInfo[0].launchView.startEntryDate
    } catch (e) {
      console.log(e);
    }




    console.log(pair_info);


  }
}




function get_upcoming(region) {
  console.log(region);
  url = "https://api.nike.com/product_feed/threads/v2/?filter=marketplace%28" + region.marketplace + "%29&filter=upcoming%28true%29&filter=language%28" + region.language + "%29&filter=channelId%28010794e5-35fe-4e32-aaff-cd2c74f89d61%29&filter=exclusiveAccess%28true%2Cfalse%29"
  request.get(url, (err, res, body) => {
    if (err != null) {
      console.log("err");
      return "non"
    }
    console.log("on vera");
    console.log(JSON.parse(body));
    get_pairs_info(JSON.parse(body).objects)
  })
}





get_upcoming(region_info.Taiwan)
