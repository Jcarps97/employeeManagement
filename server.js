//The basic stuff
const inquirer = require("inquirer");
const mysql = require("mysql2");
const dotenv = require('dotenv').config();

//Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASS, //Employ ENV later for encryption
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

const initQuestion =
{
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View Employees', 'View Roles', 'View Departments', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee'],
    name: 'init',
};

const deptQuestion = 
{
    type: 'input',
    message: 'What is the department you would like to add?',
    name: 'deptName'
};

const roleQuestions = [
{
    type: 'input',
    message: 'What role would you like to add?',
    name: 'addRole'
},
{
    type: 'input',
    message: 'What is the salary for this role?',
    name: 'roleSalary'
},
{
    type: 'input',
    message: 'What department does this role belong to?',
    name: 'roleDept'
}
]

const employeeQuestions = [
{
    type: 'input',
    message: 'Enter first name',
    name: 'firstName'
},
{
    type: 'input',
    message: 'Enter Last name',
    name: 'lastName'
},
{
    type: 'input',
    message: 'Enter role',
    name: 'empRole'
},
{
    type: 'input',
    message: 'Enter respective manager or leave null if manager',
    name: 'empManager'
}
]

const updateEmployeeQuestion = [
{
    type: 'input',
    message: 'Enter new role',
    name: 'updateRole'
}
]



function viewDepartments() {
    console.log("viewDepartments triggers")
    let sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
       return;
       }
           console.log(rows)
       });
init()
}

function viewRoles() {
    console.log("viewRole triggers")
    let sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
       return;
       }
           console.log(rows)
       });
init()
}

function viewEmployees() {
    console.log("viewEmployees triggers")
    let sql = `SELECT * FROM employees`;
    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
       return;
       }
            console.log(rows)
       });
init()
}

function addEmployee() {
    console.log("addEmployee triggers")
    inquirer.prompt(employeeQuestions)
    .then(resp => {
        db.query('INSERT INTO employees VALUES (?, ?, ?, ?)', [resp.firstName, resp.lastName, resp.empRole, resp.empManager],
        function (err, result) {
            if (result){
                console.log("Added employee!");
                init();
            } else {
                console.log("Error!");
                init();
            }
        })
    })
//Node prompts for employee data points
//Incorporate node response values into post request
}

function addRole() {
    console.log("addRole triggers")
    inquirer.prompt(roleQuestions)
    .then(resp => {
        db.query('INSERT INTO roles VALUES (?, ?, ?)', [resp.addRole, resp.roleSalary, resp.roleDept],
        function (err, result) {
            if (result){
                console.log("Added role!");
                init();
            } else {
                console.log("Error!");
                init();
            }
        })
    })
//Node prompts for role data points
//Incorporate node response values into post request
}

function addDepartment() {
    console.log("addDepartment triggers")
    inquirer.prompt(deptQuestion)
    .then(resp => {
        db.query('INSERT INTO departments VALUES (?)', [resp.deptName],
        function (err, result) {
            if (result){
                console.log("Added department!");
                init();
            } else {
                console.log("Error!");
                init();
            }
        })
    })
//Node prompts for department data points
//Incorporate node response values into post request
}

// function updateEmployee() {
//     This is gonna suck
//     Maybe attempt something similar to 'add' functions, 
//     depends on prior functions' success
// }

function init() {
    inquirer.prompt(initQuestion)
    .then(response => {
        if(response.init === 'View Employees') {
            viewEmployees()
        }
        else if(response.init === 'View Departments') {
            viewDepartments()
        }
        else if(response.init === 'View Roles') {
            viewRoles()
        }
        else if(response.init === 'Add Employee') {
            addEmployee()
        }
        else if(response.init === 'Add Role') {
            addRole()
        }
        else if(response.init === 'Add Department') {
            addDepartment()
        }
        else if(response.init === 'Update Employee') {
            updateEmployee()
        }

    })
}
init()
    //Node prompt, multiple choice to act as switch board
    //for triggering get and post requests.
    //Should be cycled after every function.
    //Reference teamprofilegenerator for formatting.