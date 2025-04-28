import mysql2 from "mysql2/promise";

const access = {
    user: "root",
    password: "root",
    database: "dbms",
};

const mysqlConnectionPool = mysql2.createPool(access);

export default mysqlConnectionPool;
