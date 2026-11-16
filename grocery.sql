
-- GROCERY APP DATABASE
-- STEP 1: Create Database
CREATE DATABASE IF NOT EXISTS grocery;
USE grocery;


-- =====================================
-- STEP 2: Drop Old Tables
-- WARNING: This deletes existing table data
-- =====================================

DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

SHOW TABLES;

-- =====================================
-- STEP 3: Create Users Table
-- =====================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL
);
DESCRIBE users;

-- =====================================
-- STEP 4: Test User
-- =====================================
-- Create your test user using the /signup API.
-- The API will hash the password using bcrypt.
-- Do not insert a plain-text password here.


-- =====================================
-- STEP 5: Create Products Table
-- =====================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    image TEXT,
    category VARCHAR(50)
);


-- =====================================
-- STEP 6: Insert Products
-- =====================================

INSERT INTO products (name, price, image, category)
VALUES
(
    'Black T-Shirt',
    799,
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500',
    'T-Shirt'
),
(
    'Blue T-Shirt',
    599,
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
    'T-Shirt'
),
(
    'Slim Fit Jeans',
    1499,
    'https://images.unsplash.com/photo-1542272604-787c3835535d',
    'Jeans'
),
(
    'Running Shoes',
    2499,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    'Shoes'
),
(
    'White Sneakers',
    1799,
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    'Shoes'
);


-- =====================================
-- STEP 7: Create Cart Table
-- =====================================

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    FOREIGN KEY (user_id)
        REFERENCES users(id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);


-- =====================================
-- STEP 8: Create Orders Table
-- =====================================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    Address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PLACED',
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);


-- =====================================
-- STEP 9: Create Order Items Table
-- =====================================

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id)
        REFERENCES orders(id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- =====================================
-- STEP 10: Check Users
-- =====================================

SELECT * FROM users;


-- =====================================
-- STEP 11: Check Products
-- =====================================

SELECT * FROM products;


-- =====================================
-- STEP 12: Check Cart
-- =====================================

SELECT * FROM cart;
DESCRIBE cart;

-- =====================================
-- STEP 13: Check Orders
-- =====================================

SELECT * FROM orders;
DESCRIBE orders;

-- =====================================
-- STEP 14: Check Order Items
-- =====================================

SELECT * FROM order_items;
DESCRIBE order_items;


-- =====================================
-- STEP 15: Check MySQL Port
-- =====================================

SHOW VARIABLES LIKE 'port';

SELECT @@hostname, @@port;



-- STEP 16: Test Cart JOIN


SELECT
    cart.id,
    cart.user_id,
    cart.product_id,
    cart.quantity,
    products.name,
    products.price,
    products.image,
    products.category
FROM cart
JOIN products
    ON cart.product_id = products.id;
    
    CREATE TABLE wishlist(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_wishlist(user_id,product_id),
    
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE,
    
    FOREIGN KEY(product_id) REFERENCES products(id)
    ON DELETE CASCADE );
   
   SELECT * FROM wishlist;
    SHOW TABLES;
    DESCRIBE wishlist;
    
    
    
    CREATE TABLE addresses(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    city VARCHAR(100) NOT NULL,
    building VARCHAR(255) NOT NULL,
    PINCODE VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE 
    CASCADE
    );
    
   
SHOW TABLES LIKE 'addresses';
SELECT * FROM addresses;
  SELECT * FROM grocery.addresses;

    