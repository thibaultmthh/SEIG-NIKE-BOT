ipc.send("get_all_users")
ipc.send("get_all_address")
ipc.send("get_all_pay")


ipc.on("all_address", (event, data)=>{
  $("#select_address").empty();
  for (let i in data) {
    address = data[i]
    let element = "<option value='"+address.id+"'  >"+address.address_name+"</option>"
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

ipc.on("all_users", (event, data)=>{console.log(data, "all_users");})







$("#myBtdn").click(()=>{
  let proxy = {
    username: $("#proxy_username").val().trim(),
    password: $("#proxy_password").val().trim(),
    domain: $("#proxy_host").val().trim(),
    port: $("#proxy_port").val().trim(),

  }
  let acc_info = {
    username: $("#user_username").val().trim(),
    password: $("#user_password").val().trim(),
    proxy: proxy,
    address_id: $("#select_address").val().trim(),
    pay_id: $("#select_payment").val().trim(),
    error: ""

  }
  console.log(acc_info);
  ipc.send("set_user", acc_info)
})
