//The basic stuff
const inquirer = require("inquirer");
const mysql = require("mysql2");

//Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'ENTERPASSWORDHEREANDENCRYPT', //Employ ENV later for encryption
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
}



function viewDepartments() {
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

// function addEmployee()
    //Node prompts for employee data points
    //Incorporate node response values into post request

// function addRole()
    //Node prompts for role data points
    //Incorporate node response values into post request

// function addDepartment()
    //Node prompts for department data points
    //Incorporate node response values into post request

// function updateEmployee()
    //Maybe attempt something similar to 'add' functions, 
    //depends on prior functions' success

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
            addDepartments()
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