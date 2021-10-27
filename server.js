//The basic stuff
const { json } = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const dotenv = require('dotenv').config();

//Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASS,
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
    message: 'What is the salary for this role? (Integer value, only)',
    name: 'roleSalary'
},
{
    type: 'list',
    message: 'What department does this role belong to?',
    choices: [`SELECT department_name FROM departments`],
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
    message: 'Enter respective manager or enter null if manager',
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

// CONCAT(manager.first_name, ' ', manager.last_name) AS manager
// FROM employee
// LEFT JOIN roles ON employee.role_id = roles.id
// LEFT JOIN departments ON roles.department_id = departments.id
// LEFT JOIN employee manager ON manager.id = employee.manager_id

function viewEmployees() {
//Sequel statements currently pull manager name OR department/role name, not both.
    console.log("viewEmployees triggers")
    let sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name,
    CONCAT(manager.first_name, " ", manager.last_name) AS manager
    FROM employees

    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON manager.id = employees.manager_id`;
    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err)
            // res.status(500).json({ error: err.message });
       return;
       }
            console.log(rows)
            init()
       });
}

function addEmployee() {
//ADD SELECTOR FOR PICKING ROLE INSTEAD OF ENTERING
    console.log("addEmployee triggers")
    inquirer.prompt(employeeQuestions)
    .then(resp => {
        db.query('INSERT INTO employees VALUES (?, ?, ?, ?)', [resp.firstName, resp.lastName, resp.empRole, resp.empManager],
        function (err, result) {
            if (result){
                console.log("Added employee!");
                init();
            } else {
                console.log(err)
                console.log("Error!");
                init();
            }
        })
    })
//Node prompts for employee data points
//Incorporate node response values into post request
}

function addRole() {
//ADD SELECTOR FOR PICKING DEPARTMENT
    console.log("addRole triggers")
    inquirer.prompt(roleQuestions)
    .then(resp => {
        db.query('INSERT INTO roles VALUES (?, ?, ?)', [resp.addRole, resp.roleSalary, resp.roleDept],
        function (err, result) {
            if (result){
                console.log("Added role!");
                init();
            } else {
                console.log(err)
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
        db.query('INSERT INTO departments (department_name) VALUES (?)', [resp.deptName],
        function (err, result) {
            if (result){
                console.log("Added department!");
                init();
            } else {
                console.log(err)
                console.log("Error!");
                init();
            }
        })
    })
//Node prompts for department data points
//Incorporate node response values into post request
}

function updateEmployee() {
    let sql1 = `SELECT employees.first_name, employees.last_name FROM employees`
    db.query(sql1, (err, rows) => {
        // console.log(rows)
        rows = rows.map( function(employee) {
            return employee.first_name + " " + employee.last_name
        })
        // console.log(rows)
        employeeUpdate =
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: rows,
            name: 'updateEmployee'
        }
        // console.log(rows)
        inquirer.prompt(employeeUpdate)
    return employeeUpdate
    })

    let sql2 = `SELECT roles.title FROM roles`
    db.query(sql2, (err, rows) => {
        rows = rows.map( function(role) {
            return role.title
        })
        roleUpdate = 
        {
            type: 'list',
            message: 'Which role would you like to select?',
            choices: rows,
            name: 'updateRole'   
        }
        inquirer.prompt(roleUpdate)
    return roleUpdate
    })

//Last step of update not quite functional
// let sql3 = `UPDATE employees SET employees.role_id = ? WHERE employee.id = ?`
// db.query(`UPDATE employees SET employees.role_id = ? WHERE employee.id = ?`, [roleUpdate, employeeUpdate] )
}

function init() {
    inquirer.prompt(initQuestion)
    .then(resp => {
        if(resp.init === 'View Employees') {
            viewEmployees()
        }
        else if(resp.init === 'View Departments') {
            viewDepartments()
        }
        else if(resp.init === 'View Roles') {
            viewRoles()
        }
        else if(resp.init === 'Add Employee') {
            addEmployee()
        }
        else if(resp.init === 'Add Role') {
            addRole()
        }
        else if(resp.init === 'Add Department') {
            addDepartment()
        }
        else if(resp.init === 'Update Employee') {
            updateEmployee()
        }

    })
}
init()
    //Node prompt, multiple choice to act as switch board
    //for triggering get and post requests.
    //Should be cycled after every function.
    //Reference teamprofilegenerator for formatting.