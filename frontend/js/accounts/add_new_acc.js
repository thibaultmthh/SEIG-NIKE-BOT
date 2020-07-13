ipc.on("all_address", (event, data)=>{
  $("#select_address").empty();
  for (let i in data) {
    address = data[i]
    let element = "<option value='"+address.id+"'  >"+address.name+"</option>"
    $("#select_address").append(element)
  }
})
ipc.on("all_pay", (event, data)=>{
  $("#select_payment").empty();
  for (let i in data) {
    pay = data[i]
    let element = "<option value='"+pay.id+"'  >"+pay.cardType+"|"+pay.accountNumber+"</option>"
    $("#select_payment").append(element)
  }
})
