Tasks = document.getElementById("Tasks")
Shipping = document.getElementById("Shipping")
Accounts = document.getElementById("Accounts")


Tasks_div = document.getElementById("Tasks_div")
profils_div = document.getElementById("profils_div")
Accounts_div = document.getElementById("Accounts_div")

actuel_ligne = Tasks
actuel_main = Tasks_div


Tasks.addEventListener("click", function() {
  actuel_ligne.classList.remove("ligne_bas")
  Tasks.classList.add("ligne_bas")
  actuel_main.style.display = "none"
  Tasks_div.style.display="block"
  actuel_ligne = Tasks;
  actuel_main = Tasks_div
})
Shipping.addEventListener("click", function() {
  actuel_ligne.classList.remove("ligne_bas")
  Shipping.classList.add("ligne_bas")
  actuel_main.style.display = "none"
  profils_div.style.display = "block"
  actuel_ligne = Shipping;
  actuel_main = profils_div
})
Accounts.addEventListener("click", function() {
  actuel_ligne.classList.remove("ligne_bas")
  Accounts.classList.add("ligne_bas")
  actuel_main.style.display = "none"
  Accounts_div.style.display = "block"
  actuel_ligne = Accounts;
  actuel_main = Accounts_div
})

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];


btn.addEventListener("click", function() {
  modal.style.display = "block";
  console.log("ok");
})


window.onclick = function(event) {
  if (event.target == modal) {
    console.log(event.target);
    modal.style.display = "none";
    console.log("putain !!!!");
  }
}
