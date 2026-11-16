const db = require("./db");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());


const SECRET_KEY = "my_secret_key";


// =========================
// TEST API

app.get("/", (req, res) => {
  res.send("Backend running ✅");
});



// AUTH MIDDLEWARE


const verifyToken = (req, res, next) => {
   console.log("AUTH HEADER:", req.headers.authorization);

const authHeader = req.headers.authorization;

  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
 

    console.log("TOKEN RECEIVED:", !!token);


  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {

   if (err) {
  console.log("JWT ERROR:", err.message);

  return res.status(401).json({
    success: false,
    message: "Invalid or expired token",
  
  });
}
    

    req.userId = decoded.userId;
    next();
  });
};



// LOGIN

app.post("/login", (req, res) => {
    console.log("LOGIN BODY:", req.body);
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are requied"
    })
  }

  const sql = `
    SELECT id, name ,email,phone,password  
    FROM users 
      WHERE email = ?`;


  db.query(sql, [email.trim()], async (err, result) => {
    if (err) {
      console.log("LOGIN DB ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Database error"
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        successs: false,
        message: "Invalid email or password"
      });
    }

    try {

      const user = result[0];
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      const token = jwt.sign(
        {
          userId: user.id
        },
        SECRET_KEY,
        {
          expiresIn: "1d"
        }
      );

      // Password response
      const { password: _, ...safeUser } = user;
      return res.json({
        success: true,
        token,
        user: safeUser
      });



    } catch (error) {
      console.log('RAZORPAY ERROR:', error);
      console.log('ERROR CODE:', error?.code);
      console.log('ERROR DESCRIPTION:', error?.description);

      debugger;
      return res.status(500).json({
        success: false,
        message: "Login failed"
      });
    }

  });
});


// SIGNUP


app.post("/signup", (req, res) => {
  console.log("SIGNUP DEBUG");
  console.log("Request received!");
  console.log("Request body:", {
    name: req.body?.name,
    email: req.body?.email,
    phone: req.body?.phone,
    passwordReceived: !!req.body?.password,
  });

  const { name, email, phone, password } = req.body;
  // Validation

  if (!name?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password  must be at least 6 characters"
    });
  }

  // Check email

  const checkSql = `
    SELECT id  FROM users WHERE email = ?`;

  db.query(checkSql, [email.trim()], async (err, result) => {
    if (err) {

      // console.log("CHECK EMAIL ERROR:", err);
      console.error("CHECK EMAIL ERROR:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
        // message: "Database error"
      });
    }


    // Email already exists

    if (result.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    try {
      // password hash
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const insertSql = `
      INSERT INTO users
      (name, email, phone, password)
      VALUES (?, ?, ?, ?)`;

      db.query(
        insertSql,
        [
          name.trim(),
          email.trim(),
          phone.trim(),
          hashedPassword
        ],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("INSERT USER ERROR:", insertErr);


            return res.status(500).json({
              success: false,
              message: insertErr.message,
            });
          }
          console.log("USER CREATED, ID:", insertResult.insertId);

          return res.status(201).json({
            success: true,
            message: "Account created successfully"
          });
        }
      );

    } catch (error) {
      console.log("PASSWORD HASH ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Password hashing failed",
      });
    }
  });
});



// GET PRODUCTS


// GET ALL PRODUCTS API

app.get("/products", (req, res) => {

  const sql = `
    SELECT
      id,
      name,
      price,
      image,
      category,
      oldPrice,
      discount,
      stock,
      bestSeller,
      rating,
      reviews,
      delivery,
      description
    FROM products
    ORDER BY id ASC
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log("PRODUCT ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch products"
      });
    }

    return res.status(200).json(result);

  });

});





// GET CART


app.get("/cart", verifyToken, (req, res) => {

  const userId = req.userId;

  const sql = `
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
      ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {

    if (err) {

      console.log("GET CART ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch cart"
      });
    }

    return res.json(result);

  });

});



// ADD TO CART


app.post("/cart", verifyToken, (req, res) => {

  const userId = req.userId;

  const {
    product_id,
    quantity
  } = req.body;


  if (!product_id) {

    return res.status(400).json({
      success: false,
      message: "Product ID is required"
    });
  }


  // Check product already exists

  const checkSql = `
    SELECT *
    FROM cart
    WHERE product_id = ?
    AND user_id = ?
  `;

  db.query(
    checkSql,
    [
      product_id,
      userId
    ],
    (err, result) => {

      if (err) {

        console.log("CHECK CART ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Database error"
        });
      }


      // Already exists

      if (result.length > 0) {

        const updateSql = `
          UPDATE cart
          SET quantity = quantity + 1
          WHERE product_id = ?
          AND user_id = ?
        `;

        db.query(
          updateSql,
          [
            product_id,
            userId
          ],
          (err) => {

            if (err) {

              console.log("UPDATE CART ERROR:", err);

              return res.status(500).json({
                success: false,
                message: "Failed to update cart"
              });
            }

            return res.json({
              success: true,
              message: "Quantity Updated ✅"
            });

          }
        );

      }

      // New product

      else {

        const insertSql = `
          INSERT INTO cart
          (user_id, product_id, quantity)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            userId,
            product_id,
            quantity || 1
          ],
          (err) => {

            if (err) {

              console.log("ADD CART ERROR:", err);

              return res.status(500).json({
                success: false,
                message: "Failed to add item"
              });
            }

            return res.json({
              success: true,
              message: "Item Added ✅"
            });

          }
        );

      }

    }
  );

});


// UPDATE CART


app.put("/cart/:id", verifyToken, (req, res) => {

  const userId = req.userId;

  const {
    quantity
  } = req.body;

  const {
    id
  } = req.params;


  if (quantity < 1) {

    return res.status(400).json({
      success: false,
      message: "Quantity must be at least 1"
    });
  }


  const sql = `
    UPDATE cart
    SET quantity = ?
    WHERE id = ?
    AND user_id = ?
  `;

  db.query(
    sql,
    [
      quantity,
      id,
      userId
    ],
    (err, result) => {

      if (err) {

        console.log("UPDATE CART ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to update cart"
        });
      }

      return res.json({
        success: true,
        message: "Cart Updated ✅"
      });

    }
  );

});



// DELETE CART


app.delete("/cart/:id", verifyToken, (req, res) => {
  const userId = req.userId;
  const { id } = req.params;

  const sql = `
    DELETE FROM cart
    WHERE id = ?
    AND user_id = ?
  `;

  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      console.log("DELETE CART ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to delete item"
      });
    }

    return res.json({
      success: true,
      message: "Item Deleted"
    });
  });
});


// CREATE ORDER

app.post("/orders", verifyToken, (req, res) => {
  const userId = req.userId;
  const { address, payment_id, buy_now, product_id, quantity } = req.body;

  if (typeof address !== "string" || !address.trim()) {
    return res.status(400).json({
      success: false,
      message: "Delivery address is required"
    });
  }

  if (
    buy_now &&
    (!Number.isInteger(Number(product_id)) ||
      Number(product_id) < 1 ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1)
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid product ID and quantity are required"
    });
  }

  db.beginTransaction((transactionError) => {
    if (transactionError) {
      return res.status(500).json({
        success: false,
        message: "Failed to start order transaction"
      });
    }

    const rollbackOrder = (message, error, status = 500) => {
      if (error) console.log("ORDER ERROR:", error);

      db.rollback(() => {
        if (!res.headersSent) {
          res.status(status).json({
            success: false,
            message
          });
        }
      });
    };

    const cartSql = buy_now
      ? `SELECT id AS product_id, ? AS quantity, price
         FROM products WHERE id = ? FOR UPDATE`
      : `SELECT cart.product_id, cart.quantity, products.price
         FROM cart
         JOIN products ON products.id = cart.product_id
         WHERE cart.user_id = ?
         FOR UPDATE`;

    const cartParams = buy_now
      ? [Number(quantity), Number(product_id)]
      : [userId];

    db.query(cartSql, cartParams, (cartError, items) => {
      if (cartError) {
        return rollbackOrder("Failed to get products", cartError);
      }

      if (!items || items.length === 0) {
        return rollbackOrder(
          buy_now ? "Product not found" : "Your cart is empty",
          null,
          400
        );
      }

      let totalAmount = 0;

      for (const item of items) {
        const qty = Number(item.quantity);
        const price = Number(item.price);

        if (
          !Number.isInteger(qty) || qty < 1 ||
          !Number.isFinite(price) || price < 0
        ) {
          return rollbackOrder("Invalid product or quantity", null, 400);
        }

        totalAmount += qty * price;
      }

      totalAmount = Number((totalAmount + 10).toFixed(2));

      const orderSql = `
        INSERT INTO orders
        (user_id, total_amount, Address, status, payment_id)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        orderSql,
        [userId, totalAmount, address.trim(), "PLACED", payment_id || null],
        (orderError, orderResult) => {
          if (orderError) {
            return rollbackOrder("Failed to create order", orderError);
          }

          const orderId = orderResult.insertId;

          const orderItems = items.map(item => [
            orderId,
            item.product_id,
            Number(item.quantity),
            Number(item.price)
          ]);

          const itemsSql = `
            INSERT INTO order_items
            (order_id, product_id, quantity, price)
            VALUES ?
          `;

          db.query(itemsSql, [orderItems], (itemsError) => {
            if (itemsError) {
              return rollbackOrder("Failed to save order items", itemsError);
            }

            const completeOrder = () => {
              db.commit((commitError) => {
                if (commitError) {
                  return rollbackOrder(
                    "Failed to complete order",
                    commitError
                  );
                }

                return res.status(201).json({
                  success: true,
                  message: "Order created successfully",
                  orderId,
                  total_amount: totalAmount,
                  status: "PLACED"
                });
              });
            };

            if (buy_now) {
              return completeOrder();
            }

            db.query(
              "DELETE FROM cart WHERE user_id = ?",
              [userId],
              (clearError) => {
                if (clearError) {
                  return rollbackOrder("Failed to clear cart", clearError);
                }

                completeOrder();
              }
            );
          });
        }
      );
    });
  });
});

// GET USER PROFILE API

  app.get("/profile", verifyToken,(req,res) =>{
    const userId  = req.userId;
    const sql =`SELECT id, name, email, phone
    FROM users 
    WHERE id = ?
    `;
    db.query(sql,[userId],(err,result)=>{
      if(err){
        console.log("GET PROFILE ERROR:", err);

        return res.status(500).json({
          success: false ,
           message:"Failed to fetch profile"
        });
      }

        if(result.length ===0){
          return res.status(404).json({
            success: false,
            message:"User not found"
          });
        }
            return res.status(200).json({
              success: true, 
              user: result[0]
            });
    });
  });        


 // UPDATE PROFILE API
 app.put("/profile", verifyToken,(req, res)=>{
  const userId = req.userId;
  const {name, phone} = req.body;

  if(!name || !phone){
    return res.status(400).json({
        succesS: false,
        message:'Name and phone are required'
    });
  }
  const sql=`
      UPDATE users 
      SET name = ?, phone =?
        wHERE  id =?`;

        db.query(sql,[name.trim(),phone.trim(),userId],(err,result) =>{
          if(err){
            console.log("UPDATE PROFILE ERROR:",err);

            return res.status(500).json({
              success: false,
              messge:"Failed to update profile "
            });
        }

        if (result.affectedRows === 0){
          return res.status(404).json({
            success: false,
            message:"User not found" 
          });
        }



          return res.status(200).json({
            success: true,
            profile :"Profile updated successfully"
          })

 })

 })



       
// GET MY ORDERS API

app.get("/orders", verifyToken, (req, res) => {
  const userId = req.userId;

  const sql = `
  SELECT 
  o.id AS order_id,
  o.total_amount,
  o.Address AS address,
  o.status,
  o.payment_id,
  o.created_at,
   oi.product_id,
   oi.quantity,
   oi.price,
   p.name AS product_name,
   p.image AS product_image

    FROM orders o

    LEFT JOIN order_items oi
    ON o.id = oi.order_id 
    
    LEFT JOIN products p
    ON oi.product_id = p.id

      WHERE o.user_id = ?
      
      ORDER BY o.created_at DESC, oi.product_id ASC 
       `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.log("GET ORDERS ERROR:", err);

      return res.status(500).json({
        success: false,
        message: " Failed to fetch orders"
      })
    }

    const ordersMap = {};

    rows.forEach((row) => {
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          id: row.order_id,
          total_amount: Number(row.total_amount),
          address: row.address,
          status: row.status,
          payment_id: row.payment_id,
          created_at: row.created_at,
          items: []
        };
      }

      if (row.product_id !== null) {
        ordersMap[row.order_id].items.push({
          id: row.product_id,
          product_id: row.product_id,
          name: row.product_name,
          image: row.product_image,
          quantity: Number(row.quantity),
          price: Number(row.price)
        });
      }
    });

    return res.status(200).json({
      success: true,
      orders: Object.values(ordersMap)
    });
  })
})




// CANCEL ORDER API

// CANCEL ORDER API

app.put("/orders/:id/cancel", verifyToken, (req, res) => {
  const userId = req.userId;
  const orderId = Number(req.params.id);

  // Validate order ID
  if (!Number.isInteger(orderId) || orderId < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID"
    });
  }

  // Only cancel PLACED orders belonging to this user
  const updateSql = `
    UPDATE orders
    SET status = 'CANCELLED'
    WHERE id = ?
    AND user_id = ?
    AND status = 'PLACED'
  `;

  db.query(updateSql, [orderId, userId], (err, result) => {
    if (err) {
      console.log("CANCEL ORDER ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to cancel order"
      });
    }

    if (result.affectedRows === 0) {

      // Check whether order exists
      const checkSql = `
        SELECT id, status
        FROM orders
        WHERE id = ? AND user_id = ?
      `;

      return db.query(checkSql, [orderId, userId], (checkError, rows) => {
        if (checkError) {
          return res.status(500).json({
            success: false,
            message: "Failed to check order"
          });
        }

        if (rows.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Order not found"
          });
        }

        return res.status(400).json({
          success: false,
          message: "This order cannot be cancelled",
          status: rows[0].status
        });
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      status: "CANCELLED"
    });
  });
});

// UPDATE ORDER STATUS API


app.put("/orders/:id/status", verifyToken, (req, res) => {
  const userId = req.userId;
  const orderId = Number(req.params.id);
  const { status } = req.body;

  const allowedStatuses = ["SHIPPED", "DELIVERED"];
  const newStatus = String(status || "").toUpperCase();

  // Validate order ID
  if (!Number.isInteger(orderId) || orderId < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID"
    });
  }

  // Validate status
  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status"
    });
  }

  const sql = `
    UPDATE orders
    SET status = ?
    WHERE id = ?
    AND user_id = ?
    AND status = ?
  `;

  const previousStatus =
    newStatus === "SHIPPED" ? "PLACED" : "SHIPPED";

  db.query(
    sql,
    [newStatus, orderId, userId, previousStatus],
    (err, result) => {
      if (err) {
        console.log("UPDATE ORDER STATUS ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to update order status"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({
          success: false,
          message: "Order not found or invalid status transition"
        });
      }

      return res.json({
        success: true,
        message: "Order status updated successfully",
        status: newStatus
      });
    }
  );
});


// / 1. ADD TO WISHLIST
app.post("/wishlist", verifyToken, (req, res) => {

  const userId = req.userId;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({
      success: false,
      message: "Product ID is required"
    });
  }

  const sql = `
        INSERT IGNORE INTO wishlist (user_id, product_id)
        VALUES (?, ?)
    `;

  db.query(sql, [userId, product_id], (err, result) => {

    if (err) {
      console.log("WISHLIST ADD ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to add wishlist"
      });
    }

    if (result.affectedRows === 0) {
      return res.json({
        success: true,
        message: "Product already in wishlist"
      });
    }

    res.json({
      success: true,
      message: "Product added to wishlist"
    });
  });
});


// 2. GET WISHLIST
app.get("/wishlist", verifyToken, (req, res) => {

  const userId = req.userId;
    console.log("WISHLIST USER ID:", userId);

  const sql = `
        SELECT
            wishlist.id AS wishlist_id,
            products.*
        FROM wishlist
        JOIN products
        ON wishlist.product_id = products.id
        WHERE wishlist.user_id = ?
        ORDER BY wishlist.created_at DESC
    `;

  db.query(sql, [userId], (err, result) => {

    if (err) {
      console.log("WISHLIST FETCH ERROR:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch wishlist"
      });
    }

        console.log("WISHLIST PRODUCTS:", result);

    res.json({
      success: true,
      wishlist: result
    });
  });
});


// Remove from wishlist
app.delete("/wishlist/:productId", verifyToken,(req,res)=>{
  const userId = req.userId;
  const productId = req.params.productId;

  const sql =
  `DELETE FROM wishlist
    WHERE user_id =? AND product_id = ?
  `;

  db.query(sql,[userId,productId],(err,result) => {
    if(err){
      console.log("WISHLIST DELETE ERROR:",err);

      return res.status(500).json({
        success:false,
        message:" Failed to remove wishlist"
      });
    }



  return res.status(200).json({
    success: true,
  message: result.affectedRows > 0
                ? "Product removed from wishlist"
                : "Product was already removed from wishlist"
  });
});
});

// ADDRESS MANAGEMENT APIs

// 1. Add Address

app.post("/address", verifyToken,(req,res)=>{
  const userId= req.userId;
  const {city,building,pincode} = req.body;

  if(!city?.trim() || !building?.trim() || !pincode){
    return res.status(400).json({
      success: false,
      message:"All fields are required"
    })
  }

if(!/^\d{6}$/.test(String(pincode))){
  return res.status(400).json({
    success: false ,
    message:"Invalid pincode"
  })
}
  const sql = `INSERT INTO addresses (user_id,city,building ,pincode) VALUES(?,?,?,?) `;
  db.query(sql,
    [userId,city.trim(), building.trim(),String(pincode)],
    (err,result) =>{
      if(err){
        console.log("ADD ADDRESE ERROR:",err);
        return res.status(500).json({
         success: false,
          message:"Failed to save address"
        });
      }
        return res.status(201).json({
          success: true,
          message:"Address added successfully",
          id: result.insertId        
        });
      }
);
})


// 2. GET ALL ADDRESSES
app.get("/address",verifyToken,(req,res) =>{
  const userId = req.userId;

  const sql = `SELECT id ,city, building, PINCODE AS pincode,created_at
  FROM addresses 
  WHERE  user_id = ?
  ORDER BY id DESC
`;

db.query(sql,[userId],(err,result) =>{
  if(err){
    console.log("GET ADDRESS ERROR:", err);

      return res.status(500).json({
        success: false,
        message:'Failed to fetch address'
      });
  }

  return res.json({
    success: true,
    address:result
  });
});
});

// 3. UPDATE ADDRESS APi
app.put('/address/:id', verifyToken, (req, res) => {

  const id = req.params.id;
  const userId = req.userId;

  const { city, building, pincode } = req.body;

  const sql = `
    UPDATE addresses
    SET city = ?, building = ?, pincode = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    sql,
    [city, building, pincode, id, userId],
    (err, result) => {

      if (err) {
        console.log('UPDATE ADDRESS ERROR:', err.message);
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

        if(result.affectedRows === 0){
          return res.status(404).json({
            success: false,
            message:'Address not found',
          })
        }
      res.json({
        success: true,
        message: 'Address updated successfully'
      });

    }
  );
});



// 4. DELETE ADDRESS
app.delete("/address/:id",verifyToken,(req,res) =>{
    const userId = req.userId;
    const {id} = req.params;

  const sql =` DELETE FROM addresses
    WHERE id = ? AND user_id =?`;
    db.query(sql,[id,userId], (err,result) =>{
      if(err){
          console.log("DELETE ADDRESS ERROR:",err);
          return res.status(500).json({
            success: false,
            message:"Failed to delete  address"  
          });
      }

      if(result.affectedRows === 0){
        return res.status(404).json({
          success: false,
          message:"Address not found"
        });
      }

      return res.json({
        success: true ,
        message:"Address deleted successfully"
      });
    });

});

// START SERVER
app.listen(3000, "0.0.0.0", () => {
  console.log("Server started on port 3000");
});


