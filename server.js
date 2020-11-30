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
          console.log( answer.add_dept + " department was created!\n");
          start();
        }
      );
    });
}
function addRoles() {
  inquirer
    .prompt({
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
        choices: department_id
    }
    )
    .then(function (answer) {
      var query = connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function (err, res) {
          if (err) throw err;
          console.log( `${answer.title} in ${answer.department_id} for ${answer.salary} was created!\n`);
          start();
        }
      );
    });
}
