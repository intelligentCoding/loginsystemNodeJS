/*********************************************************************************
*  BTI325 – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Kashif Mahmood Student ID: 041-567-132 Date: 2018-11-04
*  Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/ 





const express = require("express");
const multer = require("multer");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();

/* 
Our server needs to know how to handle HTML files that are formatted using handlebars.
This will tell our server that any file with the “.hbs” extension (instead of “.html”) will use the handlebars “engine” (template engine).
*/
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views/layouts"),
    helpers: {
      navLink: function(url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },

      equal: function(lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      }
    }
  })
);
app.set("view engine", ".hbs");

var fs = require("fs");
const bodyParser = require("body-parser");
var dataService = require("./data-service");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

var dataService = require("./data-service");
const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(function(req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

// setup a route on the 'root' of the url
// IE: http://localhost:8080/
app.get("/", (req, res) => {
  res.render("home");
});

// now add a route for the /headers page
// IE: http://localhost:8080/headers
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/employees/add", (req, res) => {
  res.render("addEmployee");
});

app.get("/images/add", (req, res) => {
  res.render("addImage");
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
  if (req.hasOwnProperty("query")) {
    if (req.query.hasOwnProperty("status")) {
      var statusValue = req.query.status;
      if (
        statusValue &&
        (statusValue.toLowerCase() == "full time" ||
          statusValue.toLowerCase() == "part time")
      ) {
        dataService
          .getEmployeesByStatus(statusValue)
          .then(function(emp) {
            res.render("employees", { data: emp });
            // res.json(emp);
          })
          .catch(function(reason) {
            res.render({message: "no results"});
            // res.send(reason);
          });
      }

      //=======================================================
    } else if (req.query.hasOwnProperty("department")) {
      var departmentValue = req.query.department;
      if (departmentValue && (departmentValue <= 7 && departmentValue > 0)) {
        dataService
          .getEmployeesByDepartment(departmentValue)
          .then(function(emp) {
            res.render("employees", { data: emp });
            // res.send(emp);
          })
          .catch(function(reason) {
            res.send(reason);
          });
      }

      //=======================================================
    } else if (req.query.hasOwnProperty("manager")) {
      var managertValue = req.query.manager;
      if (managertValue && (managertValue <= 30 && managertValue > 0)) {
        var isManager = true;
        dataService
          .getEmployeesByManager(managertValue)
          .then(function(emp) {
            res.render("employees", { data: emp, isManager });
            // res.send(emp);
          })
          .catch(function(reason) {
            res.send(reason);
          });
      }
    } else {
      dataService
        .getAllEmployees()
        .then(function(emp) {
          res.render("employees", { data: emp });
          // res.json(emp);
        })
        .catch(function(reason) {
          console.log(reason);
          res.send(reason);
        });
    }
  } else {
    dataService
      .getAllEmployees()
      .then(function(emp) {
        res.json(emp);
      })
      .catch(function(reason) {
        console.log(reason);
        res.send(reason);
      });
  }
});

app.get("/employees/:value", (req, res) => {
  if (req.hasOwnProperty("params")) {
    if (req.params.value) {
      var num = req.params.value;
      dataService
        .getEmployeeByNum(num)
        .then(function(emp) {
          res.render("employee", { data: emp });
        })
        .catch(function(reason) {
          console.log(reason);
          res.render("employee", { message: "No Results" });
        });
    }
  }
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

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.get("/images", (req, res) => {
  var path = "./public/images/uploaded";
  fs.readdir(path, function(err, items) {
    if (!err) {
      res.render("images", { data: items });
    } else {
      res.send("No images in the folder");
    }
  });
});
app.post("/employees/add", (req, res) => {
  console.log(req.body);
  dataService
    .addEmployee(req.body)
    .then(function(emp) {
      res.redirect("/employees");
    })
    .catch(function(reason) {
      console.log(reason);
      res.send(reason);
    });
});

app.post("/employee/update", (req, res) => {
  dataService.updateEmployee(req.body).then(function() {
    res.redirect("/employees");
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
