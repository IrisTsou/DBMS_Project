import express from "express";
import cors from "cors";
import mysqlConnectionPool from "./lib/mysql.js";

const app = express();
app.use(express.json());

app.use("/", (req, res, next) => {
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-headers", "*");
    next()
});

app.get("/", (req, res) => {
    return res.send("<h1>GET!</h1>");
});

app.post("/", (req, res) => {
    return res.send("<h1>POST!</h1>");
});

app.listen(3000, () => {
    console.log("Server starts at 3000");
});
