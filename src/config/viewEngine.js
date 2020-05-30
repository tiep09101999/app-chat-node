import express from "express";
import expressExtend from "express-ejs-extend";

// config view engine

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.engine("ejs", expressExtend);
    app.set("view engine", "ejs");
    app.set("views", "./src/views")
}

module.exports = configViewEngine;