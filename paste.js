const path = require("path");
var fs = require("fs");
var employees = [];
var departments = [];
//====================================================================//
//==================================initialize()======================//
//====================================================================//
function initialize() {
  //
  let reqPath = path.join(__dirname, "/data/employees.json");
  let reqPath2 = path.join(__dirname, "/data/departments.json");

  let readEmployees = new Promise(function(resolve, reject) {
    fs.readFile(reqPath, function(err, data) {
      //console.log(data);
      if (!err) {
        console.log(data);
        employees = JSON.parse(data);
        resolve("We have got the data from employees.json");
      } else {
        reject("Unable to get the data with this error " + err);
      }
    });
  });
  readEmployees
    .then(function(fromResolve) {
      console.log(fromResolve);
    })
    .catch(function(fromReject) {
      console.log(fromReject);
    });

  fs.readFile(reqPath2, function(err, data) {
    if (!err) {
      departments = JSON.parse(data);
    } else {
      console.log(err);
    }
  });
}
//====================================================================//
//====================================================================//
console.log(employees);
initialize();
for (var i = 0; i < employees.length; i++) {
  console.log(employees[i]);
}
