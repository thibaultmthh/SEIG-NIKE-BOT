ipc.send("get_all_address", "")
ipc.send("get_all_pay")







ipc.on("all_address", (event, data) => {
  console.log(data);
  $("#liste_addresse").empty()
  for (let i in data) {
    address = data[i]

    let div_addresse = "<div class='div_addresse centrer w-100'>" +
      "        <div class='div_addresse_millieu'>" +
      "          <p>" + address.address_name + "</p>" +
      "          <p>" + address.city + "</p>" +
      "          <div class='edit edit_address' style='' id='" + address.id + "'>" +
      "            <img src='pictures/th.png' alt='' class='edit-logo'>" +
      "          </div>" +
      "        </div>" +
      "      </div>"

    $("#liste_addresse").append(div_addresse)
  }

  $("div.edit_address").on("click", (event) => {
    //event.preventDefault()
    let current = event.currentTarget
    console.log(current.getAttribute("id"));
    event.currentTarget.parentElement.parentElement.remove()
    console.log(event);
    ipc.send("remove_address", current.getAttribute("id"));

  })

})



ipc.on("all_pay", (event, data) => {
  $("#liste_card").empty()
  for (let i in data) {
    card = data[i]
    console.log(address);
    let div_card = "<div class='div_addresse centrer w-100'>" +
      "        <div class='div_addresse_millieu'>" +
      "          <p>" + card.accountNumber + "</p>" +
      "          <p>" + card.cardType + "</p>" +
      "          <div class='edit edit_pay' style='' id='" + card.id + "'>" +
      "            <img src='pictures/th.png' alt='' class='edit-logo'>" +
      "          </div>" +
      "        </div>" +
      "      </div>"

    $("#liste_card").append(div_card)
    $("div.edit_pay").on("click", (event) => {
      //event.preventDefault()
      let current = event.currentTarget
      console.log(current.getAttribute("id"));
      ipc.send("remove_pay", current.getAttribute("id"));

    })

  }

  console.log(data);
})




$("#save_addresse").on("click", () => {
  console.log("blabala");
  var address = {
    "address_name": $("#address_name").val().trim(),
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
  $("#address_name").empty()
  $("#input_Fname").empty()
  $("#input_Lname").empty()
  $("#input_address1").empty()
  $("#input_state").empty()
  $("#input_city").empty()
  $("#input_postal_code").empty()
  $("#input_phone_number").empty()
  ipc.send("get_all_address", "")

})



$("#save_payment").click(() => {
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
