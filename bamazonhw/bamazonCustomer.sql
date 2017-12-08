-- hw comment --
DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;
USE bamazon_DB;
CREATE TABLE products (
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  dept_name VARCHAR(50) NOT NULL,
  price INTEGER(20) NOT NULL,
  stock_quantity INTEGER(20) NOT NULL,
  PRIMARY KEY (item_id)
);