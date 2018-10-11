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
  return new Promise(function(resolve, reject) {
    fs.readFile(reqPath, function(err, data) {
      if (!err) {
        employees = JSON.parse(data);
        fs.readFile(reqPath2, function(err, data) {
          if (!err) {
            departments = JSON.parse(data);
            resolve("Data has been successfully read.");
          } else {
            reject(error);
          }
        });
      } else {
        reject(error);
      }
    });
  });
}

//   readEmployees
//     .then(function(fromResolve) {
//       console.log(fromResolve);
//     })
//     .catch(function(fromReject) {
//       console.log(fromReject);
//     });
// }
//====================================================================//
//====================================================================//
// initialize();
function getAllEmployees() {
  return new Promise(function(resolve, reject) {
    if (employees.length == 0) {
      reject("There are no employees");
    } else {
      resolve(employees);
    }
  });
}

function getManagers() {
  var list = [];
  var error = "";
  return new Promise(function(resolve, reject) {
    if (employees.length == 0) {
      error = "The data is not there";
    } else {
      for (var i = 0; i < employees.length; i++) {
        if (employees[i].isManager) {
          list.push(employees[i]);
        }
      }

      if (list.length == 0) {
        error = "None of the employees are managers.";
      }
    }
    if (error.length == 0) {
      resolve(list);
    } else {
      reject(error);
    }
  });
}

function getDepartments() {
  return new Promise(function(resolve, reject) {
    if (departments.length == 0) {
      reject("There are no Departments");
    } else {
      resolve(departments);
    }
  });
}

//module.exports.initialize = initialize;
module.exports.getAllEmployees = getAllEmployees;
module.exports.getManagers = getManagers;
module.exports.getDepartments = getDepartments;
module.exports.initialize = initialize;
