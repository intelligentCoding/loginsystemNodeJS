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

function addEmployee(employeeData) {
  return new Promise(function(resolve, reject) {
    if (employeeData) {
      if (employeeData.isManager) {
        employeeData.isManager = true;
      } else {
        employeeData.isManager = false;
      }
      employeeData.employeeNum = employees.length + 1;
      resolve(employees.push(employeeData));
    } else {
      reject("Empty data");
    }
  });
}

function getEmployeesByStatus(status) {
  return new Promise(function(resolve, reject) {
    var returnEmployees = [];
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].status.toLowerCase() == status.toLowerCase()) {
        returnEmployees.push(employees[i]);
      }
    }
    if (returnEmployees.length != 0) {
      resolve(returnEmployees);
    } else {
      reject("Employee not find");
    }
  });
}

function getEmployeesByDepartment(department) {
  return new Promise(function(resolve, reject) {
    var returnDepartment = [];
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].department == department) {
        returnDepartment.push(employees[i]);
      }
    }
    if (returnDepartment.length != 0) {
      resolve(returnDepartment);
    } else {
      reject("No departments to show. ");
    }
  });
}

function getEmployeesByManager(manager) {
  return new Promise(function(resolve, reject) {
    var returnEmployeesByManager = [];
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].employeeManagerNum == manager) {
        returnEmployeesByManager.push(employees[i]);
      }
    }
    if (returnEmployeesByManager.length != 0) {
      resolve(returnEmployeesByManager);
    } else {
      reject("No employee under this manager. ");
    }
  });
}

function getEmployeeByNum(num) {
  return new Promise(function(resolve, reject) {
    var returnEmployeeByNum = [];
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].employeeNum == num) {
        returnEmployeeByNum.push(employees[i]);
      }
    }
    if (returnEmployeeByNum.length != 0) {
      resolve(returnEmployeeByNum);
    } else {
      reject("No departments to show. ");
    }
  });
}

function updateEmployee(employeeData) {
  return new Promise(function(resolve, reject) {
    //We don't want our loop to keep going even after finding our employee we need to update.
    var forLoopNum = employees.length;
    for (var i = 0; i < forLoopNum; i++) {
      if (employees[i].employeeNum == employeeData.employeeNum) {
        forLoopNum = i;

        employees[i].firstName = employeeData.firstName;
        employees[i].lastName = employeeData.lastName;
        employees[i].email = employeeData.email;
        employees[i].addressStreet = employeeData.addressStreet;
        employees[i].addressCity = employeeData.addressCity;
        employees[i].addressState = employeeData.addressState;
        employees[i].addressPostal = employeeData.addressPostal;
        employees[i].employeeManagerNum = employeeData.employeeManagerNum;
        employees[i].status = employeeData.status;
      }
    }
    resolve("It is done");
  });
}

//module.exports.initialize = initialize;
module.exports.getAllEmployees = getAllEmployees;
module.exports.getManagers = getManagers;
module.exports.getDepartments = getDepartments;
module.exports.initialize = initialize;
module.exports.addEmployee = addEmployee;
module.exports.getEmployeesByStatus = getEmployeesByStatus;
module.exports.getEmployeesByDepartment = getEmployeesByDepartment;
module.exports.getEmployeesByManager = getEmployeesByManager;
module.exports.getEmployeeByNum = getEmployeeByNum;

module.exports.updateEmployee = updateEmployee;
