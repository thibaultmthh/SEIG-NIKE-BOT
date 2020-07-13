ipc.send("get_all_address", "")

ipc.on("all_address", (event, data) => {
  $("#liste_addresse").empty()
  for (let i in data) {
    address = data[i]
    console.log(address);
    let div_addresse = "<div class='div_addresse centrer w-100'>"+
"        <div class='div_addresse_millieu'>"+
"          <p>"+address.address1+"</p>"+
"          <p>Ville</p>"+
"          <div class='edit' style=''>"+
"            <img src='pictures/th.png' alt='' class='edit-logo'>"+
"          </div>"+
"        </div>"+
"      </div>"

    $("#liste_addresse").append(div_addresse)
  }

  console.log(data);
})



$("#save_address").on("click",()=>{
  console.log("blabala");
  var address = {
    "firstName": $("#input_Fname").val().trim(),
    "lastName": $("#input_Lname").val().trim(),
    "address1": $("#input_address1").val().trim(),
    "address2": "",
    "address3": "",
    "state": $("#input_state").val().trim(),
    "city": $("#input_city").val().trim(),
    "postalCode": $("#input_postal_code").val().trim(),
    "country": "FR",
    "phoneNumber": $("#input_phone_number").val().trim(),
    //"email": "thibault.mathian@free.fr"
  }
  console.log(address);
  ipc.send("set_address", address)
  $("#input_Fname").empty()
  $("#input_Lname").empty()
  $("#input_address1").empty()
  $("#input_state").empty()
  $("#input_city").empty()
  $("#input_postal_code").empty()
  $("#input_phone_number").empty()
  ipc.send("get_all_address", "")

})



$("#save_payment").on("click",()=>{
  console.log("blabala");
  var card_info = {
    "accountNumber": $('#accountNumber').val().trim(),
    "cardType": $("#cardType").val().trim(),
    "expirationMonth": $("#expirationMonth").val().trim(),
    "expirationYear": $("#expirationYear").val().trim(),
    "cvNumber": $("#cvNumber").val().trim()
  }
  console.log(address);
  ipc.send("set_pay", card_info)
  $("#accountNumber").empty()
  $("#cardType").empty()
  $("#expirationMonth").empty()
  $("#expirationYear").empty()
  $("#cvNumber").empty()
  ipc.send("get_all_pay", "")

})












//
