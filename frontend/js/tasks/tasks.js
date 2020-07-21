ipc.send("get_all_tasks")

ipc.on("all_tasks", (event, data) => {
  $("#all_tasks_c").empty();
  for (var i in data) {
    let task = data[i]
    let div = "<div class='account_element'>" +
      "      <div class='centrer_element'>" +
      "        <div class='display-flex'>" +
      "          <div class='name_div'>" +
      "            <p>" + task.name + "</p>" +
      "          </div>" +
      "          <div class='proxy_div'>" +
      "            <p>" + task.entry_date.substring(5, 16) + " UTC" + "</p>" +
      "          </div>" +
      "          <div class='shipping_div'>" +
      "            <p>" + task.region + "</p>" +
      "          </div>" +
      "          <div class='shipping_div'>" +
      "            <p>" + task.status + "</p>" +
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
    $("#all_tasks_c").append(div)
  }



})
