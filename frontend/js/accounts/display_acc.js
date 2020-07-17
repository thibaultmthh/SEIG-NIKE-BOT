ipc.send("get_all_users")


ipc.on("all_users", (event, data) => {
  $("#all_user_c").empty();
  for (var i in data) {
    let user = data[i]
    let div = "<div class='account_element'>" +
      "      <div class='centrer_element'>" +
      "        <div class='display-flex'>" +
      "          <div class='name_div'>" +
      "            <p>" + user.username + "</p>" +
      "          </div>" +
      "          <div class='proxy_div'>" +
      "            <p>" + user.proxy.domain + "</p>" +
      "          </div>" +
      "          <div class='shipping_div'>" +
      "            <p>" + user.status + "</p>" +
      "          </div>" +
      "          <div class='other_div'>" +
      "          </div>" +
      "        </div>" +
      "      </div>" +
      "      <div class='actions_accounts'>" +
      "        <div class='del_account'>" +
      "          <img src='pictures/ths.png' alt='' class='h-75 photo_poubelle'>" +
      "        </div>" +
      "      </div>" +
      "    </div>"
      $("#all_user_c").append(div)
  }



})
