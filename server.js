/*********************************************************************************
*  BTI325 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Kashif mahmood Student ID: 041-567-132 Date: Oct 6th 2018
*
*  Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/ 


const express = require("express");
const app = express();
var dataService = require("./data-service");
app.use(express.static(__dirname + "/public"));

var path = require("path");

var dataService = require("./data-service");
const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a route on the 'root' of the url
// IE: http://localhost:8080/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/home.html"));
});

// now add a route for the /headers page
// IE: http://localhost:8080/headers
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get("/departments", (req, res) => {
  dataService
    .getDepartments()
    .then(function(departmnt) {
      res.json(departmnt);
    })
    .catch(function(reason) {
      console.log(reason);
      res.send(reason);
    });
});

app.get("/employees", (req, res) => {
  dataService
    .getAllEmployees()
    .then(function(emp) {
      res.json(emp);
    })
    .catch(function(reason) {
      console.log(reason);
      res.send(reason);
    });
});

app.get("/managers", (req, res) => {
  dataService
    .getManagers()
    .then(function(emp) {
      res.json(emp);
    })
    .catch(function(reason) {
      console.log(reason);
      res.send(reason);
    });
});

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.use(express.static("public"));

// listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
dataService
  .initialize()
  .then(function(data) {
    app.listen(HTTP_PORT, onHttpStart);
    console.log(data);
  })
  .catch(function(reason) {
    console.log(reason);
  });
// app.listen(HTTP_PORT, onHttpStart);
