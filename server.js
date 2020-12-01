const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");
const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "employees_DB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

function start() {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "start",
      choices: [
        "Add departments",
        "Add roles",
        "Add employees",
        "View departments",
        "View roles",
        "View employees",
        "Update employee roles",
        "Exit",
      ],
    })
    .then((answers) => {
      switch (answers.start) {
        case "Add departments":
          addDepartments();
          break;
        case "Add roles":
          addRoles();
          break;
        case "Add employees":
          addEmployees();
          break;
        case "View departments":
          viewwDepartments();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "Update employee roles":
          updateEmployeeRoles();
          break;
        //   case "View All Roles":
        //       viewAllROles();
        //       break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

// Add Department

function addDepartments() {
  inquirer
    .prompt({
      name: "add_dept",
      type: "input",
      message: "Which department would you like to add?",
      validate: input => {
        if (input.trim() != "") {
          return true;
        }
        return "Invalid input. Please enter your department name."
      }
    })
    .then(function (answer) {
      var query = connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.add_dept,
        },
        function (err, res) {
          if (err) throw err;
          console.log(answer.add_dept + " department has been created!\n");
          start();
        }
      );
    });
}

// Add Roles

function addRoles() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    if (err) throw err;
    // console.table(result);

    let allDepartments = [];
    for (let i = 0; i < result.length; i++) {
      let eachDepartment = result[i].name;
      allDepartments.push(eachDepartment);
    }
    // console.log(allDepartments);


    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Which role would you like to add?",
          validate: input => {
            if (input.trim() != "") {
              return true;
            }
            return "Invalid input. Please enter a new role."
          }
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary?",
          validate: input => {
            if (!isNaN(input)) {
              return true;
            }
            return "Please enter a valid number."
          }
        },
        {
          name: "department_id",
          type: "list",
          message: "Please choose the role's department",
          choices: [...allDepartments]
        }
      ])
      .then(function (answer) {
        // console.log(answer);

        let department_id = "";
        for (i = 0; i < result.length; i++) {
          if (answer.department_id === result[i].name) {
            department_id = result[i].id;
          }
        }

        let query = connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.title,
            salary: answer.salary,
            department_id: department_id,
          },
          function (err, res) {
            if (err) throw err;
            console.log(`${answer.title} in ${answer.department_id} for ${answer.salary} has been created!\n`);
            start();
          }
        );
      });
  })
}

// Add Employees

function addEmployees() {
  let query = "SELECT * FROM role";
  connection.query(query, function (err, result) {
    if (err) throw err;
    // console.table(result);

    let allRoles = ["none",];
    for (let i = 0; i < result.length; i++) {
      let eachRole = result[i].title;
      allRoles.push(eachRole);
    }
    // console.log(allRoles);

    let query = "SELECT * FROM employee";
    connection.query(query, function (err, result2) {
      if (err) throw err;
      // console.table(result2);

      let allEmployees = ["none",];
      for (let i = 0; i < result2.length; i++) {
        let eachEmployee = result2[i].first_name + result2[i].last_name;
        allEmployees.push(eachEmployee);
      }
      // console.log(allEmployees);

      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?",
            validate: input => {
              if (input.trim() != "") {
                return true;
              }
              return "Invalid input. Please enter a new role."
            }
          },
          {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?",
            validate: input => {
              if (input.trim() != "") {
                return true;
              }
              return "Invalid input. Please enter a new role."
            }
          },
          {
            name: "role_id",
            type: "list",
            message: "What is the employee's role?",
            choices: [...allRoles]
          },
          {
            name: "manager_id",
            type: "list",
            message: "Who is the employee's manager?",
            choices: [...allEmployees]
          }
        ])
        .then(function (answer) {
          console.log(answer);

          let role_id = "";
          for (i = 0; i < result.length; i++) {
            if (answer.role_id === result[i].title) {
              role_id = result[i].id;
            }
          }

          let manager_id = "";
          for (i = 0; i < result2.length; i++) {
            if (answer.manager_id === result2[i].first_name + result2[i].last_name) {
              manager_id = result2[i].id;
            } else if (answer.manager_id === "none") {
              manager_id = null;
            }
          }

          let query = connection.query(
            "INSERT INTO employee SET ?",
            {
              first_name: answer.first_name,
              last_name: answer.last_name,
              role_id: role_id,
              manager_id: manager_id
            },
            function (err, res) {
              if (err) throw err;
              console.log(`Employee ${answer.first_name} ${answer.last_name} has been created!\n`);
              start();
            }
          );
        });
    })
  })
}

//View Department

function viewwDepartments() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    start();
  })
}

//View Roles

function viewRoles() {
  let query = "SELECT * FROM role";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    // const table = cTable.getTable(result);
    // console.log(table);
    start();
  })
}

//View Employess

function viewEmployees() {
  let query = "SELECT * FROM employee";
  connection.query(query, function (err, result) {
    if (err) throw err;
    console.table(result);
    start();
  })
}

//Update Employee Roles

function updateEmployeeRoles() {
  let query = "SELECT * FROM role";
  connection.query(query, function (err, result) {
    if (err) throw err;
    // console.table(result);

    let allRoles = ["none",];
    for (let i = 0; i < result.length; i++) {
      let eachRole = result[i].title;
      allRoles.push(eachRole);
    }
    // console.log(allRoles);

    let query = "SELECT * FROM employee";
    connection.query(query, function (err, result2) {
      if (err) throw err;
      // console.table(result2);

      let allEmployees = ["none",];
      for (let i = 0; i < result2.length; i++) {
        let eachEmployee = result2[i].first_name + result2[i].last_name;
        allEmployees.push(eachEmployee);
      }
      // console.log(allEmployees);
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee's role would you like to change?",
            choices: [...allEmployees]
          },
          {
            name: "role",
            type: "list",
            message: "Which role would you like to update to?",
            choices: [...allRoles]
          },
        ])
        .then(function (answer) {
          console.log(answer);

          // let role_id = "";
          // for (i = 0; i < result.length; i++) {
          //   if (answer.role === result[i].title) {
          //     role_id = result[i].id;
          //   }
          // }

          // let query = connection.query(
          //   "UPDATE employee SET ?",
          //   {
          //     first_name: answer.first_name,
          //     last_name: answer.last_name,
          //     role_id: role_id,
          //     manager_id: manager_id
          //   },
          //   function (err, res) {
          //     if (err) throw err;
          //     console.log(`Emplopyee ${answer.first_name} ${answer.last_name} has been updated!\n`);
          //     start();
          //   }
          // );
        });
    })
  })
}

