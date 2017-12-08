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
        type: "rawlist",
        message: "What would you like to do?",
        choices: ['VIEW INVENTORY', 'STOCK INVENTORY', 'ADD NEW ITEM', 'VIEW LOW INVENTORY']
    }).then(function(answer) {
        switch (answer.action) {
            case "VIEW INVENTORY":
                viewInventory();
                break;

            case "STOCK INVENTORY":
                stockInventory();
                break;

            case "ADD NEW ITEM":
                addItem();
                break;

            case "VIEW LOW INVENTORY":
                lowInventory();
                break;
        }
    });
};
start();
var addItem = function() {
    inquirer.prompt([{
        name: "product_name",
        type: "input",
        message: "What is the item you wish to submit?"
    }, {
        name: 'dept_name',
        type: "rawlist",
        message: "What department is the item in?",
        choices: ['SPORTS', 'TECH', 'LEISURE', 'CLOTHES', 'OTHER']
    }, {
        name: 'stock_quantity',
        type: 'input',
        message: 'How many?',
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            }
            else {
                return false;
            }
        }

    }, {
        name: 'price',
        type: 'input',
        message: 'What is the price of the Item submitted?',
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            }
            else {
                return false;
            }
        }

        //"UPDATE products SET ? WHERE ?",// update, updates the gun stock
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", { // insert creates a new gun, don't insert until you create new product
            product_name: answer.product_name,
            dept_name: answer.dept_name,
            stock_quantity: answer.stock_quantity,
            price: answer.price,

        }, function(err, res) {
            console.log("Your post was succesful!");
            start();
        });
    });
};
//stockInventory
var stockInventory = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log(res);
        inquirer.prompt({
            name: "choice",
            type: "list",
            choices: function(value) {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;

            },
            message: "Which Item would you like to stock?"
        }).then(function(answer) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == answer.choice) {
                    var chosenItem = res[i];
                    inquirer.prompt({
                            name: "quantity",
                            type: "input",
                            message: "How many would you like to add?",
                            validate: function(value) {
                                if (isNaN(value) == false) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }

                        })
                        .then(function(answer) {

                            if (chosenItem.stock_quantity) {
                                connection.query("UPDATE products SET ? WHERE ?", [{
                                    stock_quantity: parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity)
                                }, {
                                    item_id: chosenItem.item_id
                                }], function(err, res) {
                                    var total = parseInt(chosenItem.stock_quantity) + parseInt(answer.quantity);
                                    console.log("update was succesfull! new total is " + total);
                                    start();
                                });
                            }
                            else {
                                console.log("stocking was not successful");
                            }
                        });
                }
            }
        });

    });
};

function viewInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 50", function(err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });

}



//     inquirer.prompt({
//         name: "Are you sure you want to View Inventory?",
//         type: "input",
//         message: "What song would you like to look for?"
//     }).then(function(answer) {
//         var query = "SELECT top_albums.year, album, top_albums.position, song, top5000.artist FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year = top5000.year) ORDER BY top_albums.year;"
//         connection.query(query, { song: answer.song }, function(err, res) {
//             for (var i = 0; i < res.length; i++) {
//                 console.log(res[i]);
//             }
//             start();
//         })
//     })

// }
