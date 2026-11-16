const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "Tushar@123",
    database: "grocery"
});

db.connect((err) => {
    if (err) {
        console.log("MYSQL ERROR:", err);
        return;
    }

    console.log("MySQL Connected");
});

module.exports = db;