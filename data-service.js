const path = require("path");
var fs = require("fs");
var employees = [];
var departments = [];

const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "d5027k9hcvpd7s",
  "bkicnwwoqyntfj",
  "cbaf08ef2417c1ff1913185135dc811af3890078e09f40c88b2c76e64cc98e8f",
  {
    host: "ec2-23-23-153-145.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: true
    }
  }
);
sequelize
  .authenticate()
  .then(() => console.log("Connection success."))
  .catch(err => console.log("Unable to connect to DB.", err));

//====================================================================//
//==================Creating Employee Data Models=====================//
//====================================================================//
var Employee = sequelize.define("Employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  department: Sequelize.INTEGER,
  hireDate: Sequelize.STRING
});
//====================================================================//
//=================Creating Department Data Models====================//
//====================================================================//
var Department = sequelize.define("Department", {
  DepartmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});

// //Add existing Data to the database.
// let reqPath = path.join(__dirname, "/data/employees.json");
// let reqPath2 = path.join(__dirname, "/data/departments.json");

// fs.readFile(reqPath, function(err, data) {
//   if (!err) {
//     employees = JSON.parse(data);

//     fs.readFile(reqPath2, function(err, data) {
//       if (!err) {
//         departments = JSON.parse(data);
//       }
//     });
//   }
// });

// //Adding Employees

// for (var i = 0; i < employees.length; i++) {
//   Employee.create({
//     employeeNum: employees[i].employeeNum,
//     firstName: employees[i].firstName,
//     lastName: employees[i].lastName,
//     email: employees[i].email,
//     SSN: employees[i].SSN,
//     addressStreet: employees[i].addressStreet,
//     addressCity: employees[i].addressCity,
//     addressState: employees[i].addressState,
//     addressPostal: employees[i].addressPostal,
//     maritalStatus: employees[i].maritalStatus,
//     isManager: employees[i].isManager,
//     employeeManagerNum: employees[i].employeeManagerNum,
//     status: employees[i].status,
//     department: employees[i].department,
//     hireDate: employees[i].hireDate
//   })
//     .then(console.log("Table Created"))
//     .catch(console.log("Not Created"));
// }

//====================================================================//
//==================================initialize()======================//
//====================================================================//
function initialize() {
  //
  return new Promise(function(resolve, reject) {
    sequelize
      .sync()
      .then(function() {
        resolve("Connection was success");
      })
      .catch(function(error) {
        reject("unable to sync the database");
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
    Employee.findAll()
      .then(inComingData => {
        resolve(inComingData);
      })
      .catch("The Data is not there");
  });
}

function getManagers() {
  return new Promise(function(resolve, reject) {
    reject();
  });
}

function getDepartments() {
  return new Promise(function(resolve, reject) {
    Department.findAll()
      .then(inComingData => {
        resolve(inComingData);
      })
      .catch("The Data is not there");
  });
}

// function addDepartments(department) {
//   return new Promise(function(resolve, reject) {
//     Department.create({
//       departmentName: department.departmentName
//     })
//       .then(function() {
//         console.log("Department " + departmentName + " created");
//         resolve("Department " + departmentName + " created");
//       })
//       .catch(function(error) {
//         console.log("Couldn't Create Department ");
//         reject("Couldn't create Department" + error);
//       });
//   });
// }
function deleteEmployeeByNum(empNum) {
  return new Promise(function(resolve, reject) {
    Employee.destroy({
      where: { employeeNum: empNum }
    })
      .then(function() {
        resolve("Successfully Deleted Employee Num");
      })
      .catch(function(reason) {
        reject("Unable to Remove Employee / Employee not found");
      });
  });
}

function addDepartments(incomingDepartment) {
  var condition = true;
  if (incomingDepartment == "") {
    condition = false;
  }
  return new Promise(function(resolve, reject) {
    if (!condition) {
      Department.create({
        //       departmentName: department.departmentName
        //     })
        departmentName: incomingDepartment.departmentName
      })
        .then(function() {
          console.log(
            "Department " + incomingDepartment.departmentName + " created"
          );
          resolve(
            "Department " + incomingDepartment.departmentName + " created"
          );
        })
        .catch(function(error) {
          console.log("Couldn't add data");
          reject("Couldn't add Data");
        });
    } else {
      reject("Must Enter the Department Name");
    }
  });
}

function addEmployee(employeeData) {
  return new Promise(function(resolve, reject) {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (const prop in employeeData) {
      if (employeeData[prop] == "") {
        employeeData[prop] = null;
      }
    }
    Employee.create({
      employeeNum: employeeData.employeeNum,
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      SSN: employeeData.SSN,
      addressStreet: employeeData.addressStreet,
      addressCity: employeeData.addressCity,
      addressState: employeeData.addressState,
      addressPostal: employeeData.addressPostal,
      maritalStatus: employeeData.maritalStatus,
      isManager: employeeData.isManager,
      employeeManagerNum: employeeData.employeeManagerNum,
      status: employeeData.status,
      department: employeeData.department,
      hireDate: employeeData.hireDate
    })
      .then(function() {
        console.log("Employee " + employeeData.firstName + " created");
        resolve("Employee " + employeeData.firstName + " created");
      })
      .catch(function(error) {
        console.log("Couldn't add data");
        reject("Couldn't add Data");
      });
  });
}

function getEmployeesByStatus(statusComing) {
  var stats1 = "";
  //In our data the part time is "Part Time" and full time is "Full time"
  if (statusComing == "part time") {
    status1 = "Part Time";
  } else {
    status1 = "Full Time";
  }
  return new Promise(function(resolve, reject) {
    Employee.findAll({
      where: {
        status: status1
      }
    })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject("COuldn't get the data for status ");
      });
  });
}

function getEmployeesByDepartment(department) {
  // console.log("We are inside");
  return new Promise(function(resolve, reject) {
    Employee.findAll({
      where: {
        department: department
      }
    })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject("COuldn't get the data for Departments ");
      });
  });
}

function getEmployeesByManager(manager) {
  return new Promise(function(resolve, reject) {
    Employee.findAll({
      where: {
        employeeManagerNum: manager
      }
    })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject("COuldn't get the data for Manager ");
      });
  });
}

function getEmployeeByNum(num) {
  return new Promise(function(resolve, reject) {
    Employee.findAll({
      where: {
        employeeNum: num
      }
    })
      .then(data => {
        if (data.length > 0) {
          resolve(data);
        } else {
          reject("Employee Number is in correct");
        }
      })
      .catch(error => {
        reject("COuldn't get the data for Employee ");
      });
  });
}
function getDepartmentById(num) {
  if (num > 0) {
    return new Promise(function(resolve, reject) {
      Department.findAll({
        where: {
          DepartmentId: num
        }
      })
        .then(data => {
          if (data.length > 0) {
            resolve(data);
          } else {
            reject("The department Id is not correct");
          }
        })
        .catch(error => {
          reject("COuldn't get the data for Department ");
        });
    });
  }
}

function updateDepartments(inComingData) {
  //console.log(employeeData);
  console.log(inComingData);
  var condition = true;
  if (inComingData.departmentName == "") {
    condition = false;
  }
  return new Promise(function(resolve, reject) {
    if (condition) {
      Department.update(
        {
          departmentName: inComingData.departmentName
        },
        {
          where: { DepartmentId: inComingData.departmentId }
        }
      )
        .then(function() {
          console.log("Department " + inComingData.DepartmentId + " updated");
          resolve("Employee " + inComingData.DepartmentId + " update");
        })
        .catch(function(error) {
          console.log("Couldn't update data");
          reject("Couldn't update Data");
        });
    } //If Condition
    else {
      reject("Could Update Department");
    }
  });
}

function updateEmployee(employeeData) {
  //console.log(employeeData);
  return new Promise(function(resolve, reject) {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (const prop in employeeData) {
      if (employeeData[prop] == "") {
        employeeData[prop] = null;
      }
    }
    Employee.update(
      {
        employeeNum: employeeData.employeeNum,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        SSN: employeeData.SSN,
        addressStreet: employeeData.addressStreet,
        addressCity: employeeData.addressCity,
        addressState: employeeData.addressState,
        addressPostal: employeeData.addressPostal,
        maritalStatus: employeeData.maritalStatus,
        isManager: employeeData.isManager,
        employeeManagerNum: employeeData.employeeManagerNum,
        status: employeeData.status,
        department: employeeData.department,
        hireDate: employeeData.hireDate
      },
      {
        where: { employeeNum: employeeData.employeeNum }
      }
    )
      .then(function() {
        console.log("Employee " + employeeData.firstName + " updated");
        resolve("Employee " + employeeData.firstName + " update");
      })
      .catch(function(error) {
        console.log("Couldn't update data");
        reject("Couldn't update Data");
      });
  });
}

//module.exports.initialize = initialize;
module.exports.getAllEmployees = getAllEmployees;
module.exports.addDepartments = addDepartments;
module.exports.getManagers = getManagers;
module.exports.getDepartments = getDepartments;
module.exports.initialize = initialize;
module.exports.addEmployee = addEmployee;
module.exports.getEmployeesByStatus = getEmployeesByStatus;
module.exports.getEmployeesByDepartment = getEmployeesByDepartment;
module.exports.getEmployeesByManager = getEmployeesByManager;
module.exports.getEmployeeByNum = getEmployeeByNum;

module.exports.updateEmployee = updateEmployee;
module.exports.updateDepartments = updateDepartments;
module.exports.getDepartmentById = getDepartmentById;

module.exports.deleteEmployeeByNum = deleteEmployeeByNum;
