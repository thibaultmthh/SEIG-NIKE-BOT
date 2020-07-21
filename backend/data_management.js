const Store = require("electron-store")
const {
  v4: uuidv4
} = require('uuid');





class Users extends Store {
  constructor() {
    super()
    this.data_name = "accounts"
    this.datas = this.get(this.data_name) || [] // user
    //this.datas = []

  }
  get_D(user_email) {
    for (var index in this.datas) {
      if (this.datas.hasOwnProperty(index)) {
        if (this.datas[index].username == user_email) {
          return this.datas[index]
        }
      }
    }
    console.log(user_email, "no found in user base");
    return 0
  }

  update_D(data){
    var id = data.id
    for (var index in this.datas) {
      if (this.datas.hasOwnProperty(index)) {
        if (this.datas[index].id == id) {
          this.datas[index] = data
        }
      }
    }
    console.log(id, "no found in payment methods base");
    return 0
  }



  add_D(user_datas) {
    console.log("add user", user_datas);
    if (this.get_D(user_datas.username) == 0) {
      this.datas.push(user_datas)
      console.log(user_datas, "saved in user base")
    } else {

      for (var index in this.datas) {
        if (this.datas.hasOwnProperty(index)) {
          if (this.datas[index].email == user_datas.username) {
            this.datas[index] = user_datas
            console.log(user_datas, "saved and replace the last one");
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }


}

class Payment_methods extends Store {
  constructor() {
    super()
    this.data_name = "payment_methods"
    this.datas = this.get(this.data_name) || [] // payment_methods
    //this.datas = []

  }
  get_D(id) {
    for (var index in this.datas) {
      if (this.datas.hasOwnProperty(index)) {
        if (this.datas[index].id == id) {
          return this.datas[index]
        }
      }
    }
    console.log(id, "no found in payment methods base");
    return 0
  }

  update_D(data){
    var id = data.id
    for (var index in this.datas) {
      if (this.datas.hasOwnProperty(index)) {
        if (this.datas[index].id == id) {
          this.datas[index] = data
        }
      }
    }
    return 0
  }

  add_D(data_add) {
    data_add.id = uuidv4()
    console.log("add payment_method", data_add);
    this.datas.push(data_add)

    this.set(this.data_name, this.datas)
    return data_add.id
  }
  remove_D(id) {
    if (this.get_D(id) === undefined) {

    } else {

      for (var i in this.datas) {
        if (this.datas.hasOwnProperty(i)) {
          if (this.datas[i].id == id) {
            console.log("remove", id);
            this.datas.splice(i, 1)
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }

}

class Address extends Store {
  constructor() {
    super()
    this.data_name = "addresss"
    this.datas = this.get(this.data_name) || [] // payment_methods
    //this.datas = []

  }

  get_D(id) {
    for (var index in this.datas) {
      if (this.datas.hasOwnProperty(index)) {
        if (this.datas[index].id == id) {
          return this.datas[index]
        }
      }
    }
    console.log(id, "no found in payment methods base");
    return 0
  }

  update_D(data){
    var id = data.id
    for (var index in this.datas) {
      if (this.datas.hasOwnProperty(index)) {
        if (this.datas[index].id == id) {
          this.datas[index] = data
        }
      }
    }
    console.log(id, "no found in payment methods base");
    return 0
  }



  add_D(data_add) {
    data_add.id = uuidv4()
    console.log("add address", data_add);
    this.datas.push(data_add)

    this.set(this.data_name, this.datas)
    return data_add.id
  }
  remove_D(id) {
    if (this.get_D(id) === undefined) {

    } else {

      for (var i in this.datas) {
        if (this.datas.hasOwnProperty(i)) {
          if (this.datas[i].id == id) {
            this.datas.splice(i, 1)
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }
}


class Perm_data {
  constructor() {
    this.region_info = {
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
  }
}




class Tasks extends Store {
  constructor() {
    super()
    this.data_name = "tasks_data"
    this.datas = this.get(this.data_name) || [] // user
    //this.datas = []

  }
  get_D(id) {
    for (var index in this.datas) {
      if (this.datas.hasOwnProperty(index)) {
        if (this.datas[index].pair_id == id) {
          return this.datas[index]
        }
      }
    }
    console.log(id, "no found in task base");
    return 0
  }

  update_D(data){
    var id = data.pair_id
    for (var index in this.datas) {
      if (this.datas.hasOwnProperty(index)) {
        if (this.datas[index].pair_id == id) {
          this.datas[index] = data
        }
      }
    }
    console.log(id, "no found in task base");
    return 0
  }



  add_D(task_data) {
    console.log("add user", task_data);
    if (this.get_D(task_data.pair_id) == 0) {
      this.datas.push(task_data)
      console.log(task_data, "saved in user base")
    } else {

      for (var index in this.datas) {
        if (this.datas.hasOwnProperty(index)) {
          if (this.datas[index].pair_id == task_data.pair_id) {
            this.datas[index] = task_data
            console.log(task_data, "saved and replace the last one");
          }
        }
      }
    }

    this.set(this.data_name, this.datas)
  }


}








module.exports.Address_DS = Address
module.exports.Payment_methods_DS = Payment_methods
module.exports.Users_DS = Users
module.exports.Perm_data = Perm_data
module.exports.Tasks = Tasks


/*







user = {
username = ID
password
email
proxy
payment_method_info_id
address_info_id


status (not checked, errored, valid)
error ("" or error if errored)
}

payment_method = {
id = random
accountNumber
cardType
expirationMonth
expirationYear,
cvNumber
}



address = {
id = random
  "firstName": "Thibault",
  "lastName": "Mathian",
  "address1": "88 le sausey",
  "address2": "",
  "address3": "",
  "state": "",
  "city": "Laval",
  "postalCode": "38190",
  "country": "FR",
  "phoneNumber": "0769933717",
  "email": "thibault.mathian@free.fr"
}



task = {
product id
skuu id
region
timestamp start
status ( % ?)

}








z*/
