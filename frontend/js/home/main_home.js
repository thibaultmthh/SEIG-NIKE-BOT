//Remplire le form des region
ipc.send("get_region_list", "")
console.log("blooo");
ipc.on("region_list", (event, data) => {data.forEach(item => $("#selectRegion").prepend("<option value='" + item + "'>" + item + "</option>")); ipc.send("get_upcoming", data[0])})


//Detecter changements
$(".selectRegion").change(() => {
  let val = $(".selectRegion").val().toString();

  ipc.send("get_upcoming", val)
})


ipc.on("upcoming", (event, data) => {
  $("#chaussure_avaliable_list").empty()
  for (let i in data) {
    chaussure = data[i]
    console.log(chaussure);

    if (i % 3 == 0) {
      $("#chaussure_avaliable_list").append("<div class='ligne_chaussures  ' id='ligne_chaussures" + i + "'></div>")
    }
    let val_ligne = (i - (i % 3)).toString()

    let text_option = ""
    for (let i in chaussure.size_list){
      let size = chaussure.size_list[i]
      text_option += "<option value="+size.id+">"+size.size+"</option>"
    }
    let div_chaussure = "<div class='el_chaussure'>"+
    "<div class='h-75 p-3 haut_el_chaussure'>"+
    "   <img src='"+chaussure.photo+"' alt='photo'>"+
"       <div class=''>"+
"          <p class='nom_chaussure'>"+chaussure.name+"</p>"+
"          <p class='prix_chaussure'> <span class='mr-2'><b>Price:</b></span>"+chaussure.price+"  "+chaussure.method+"</p>"+
"          <div class='display-flex'>"+
"          <p class='mr-2'> <b>Size:</b> </p>"+
"          <select class='select_nike' name=''>"+
"              "+text_option+""+
"            </select>"+
"          </div>"+
"        </div>"+
"      </div>"+
"      <div class='p-3 centrer'>"+
"        <button type='button' name='button ' class='btn btn-primary btn_add_account start_task'>Start task</button>"+
"      </div>"+
"    </div>"

    $("#ligne_chaussures" + val_ligne).append(div_chaussure)
  }

  console.log(data);
})
