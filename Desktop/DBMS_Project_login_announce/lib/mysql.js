/* /lib/mysql.js */
import mysql2 from "mysql2/promise";

const access = {
  user: "root", // write your username
  password: "Toby0208", // write your password
  database: "Project", // write your database
};
const mysqlConnectionPool = mysql2.createPool(access);

export default mysqlConnectionPool;

