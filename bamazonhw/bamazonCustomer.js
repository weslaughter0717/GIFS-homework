var mysql = require('mysql');
var inquirer = require('inquirer');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

var start = function() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Would you like to [Buy] an item?",
        choices: ['YES', 'NO']
    }).then(function(answer) {
        switch (answer.action) {
            case "YES":
                buyItem();
                break;

            case "NO":
                start();
                break;
        }
    });
};
start();


var buyItem = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log(res);
        inquirer.prompt({
            name: "choice",
            type: "rawlist",
            choices: function(value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;

            },
            message: "Which Item would you like to purchase?"
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == answer.choice) {
                    var chosenItem = res[i];
                    inquirer.prompt({
                            name: "quantity",
                            type: "input",
                            message: "How many would you like?",
                            validate: function(value) {
                                if (isNaN(value) == false) {
                                    return true;
                                }
                                else {
                                    return false;
                                };
                            }

                        })
                        .then(function(answer) {
                            if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                                connection.query("UPDATE products SET ? WHERE ?", [{
                                    stock_quantity: parseInt(chosenItem.stock_quantity) - parseInt(answer.quantity)
                                }, {
                                    item_id: chosenItem.item_id
                                }], function(err, res) {
                                    var total = parseInt(chosenItem.price) * parseInt(answer.quantity);
                                    console.log("purchase Successfull! Your Price is: " + "$" + total);
                                    start();
                                });
                            }
                            else {
                                console.log("Not enough in stock");
                            }
                        });
                }
            }
        });

    });
};
