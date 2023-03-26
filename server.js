const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'NAZHFSHO23',
  database: 'employee_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Welcome to the Employee Tracker');
  start();
});

function start() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Exit':
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewAllRoles() {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function viewAllEmployees() {
    const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id;
    `;
  
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  }
  

function addDepartment() {
  inquirer
    .prompt({
      name: 'department',
      type: 'input',
      message: 'Enter the name of the new department:',
    })
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.department,
        },
        (err, res) => {
          if (err) throw err;
          console.log('Department added successfully!');
          start();
        }
      );
    });
}

function addRole() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter the title of the new role:',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'Enter the salary for the new role:',
        },
        {
          name: 'department_id',
          type: 'list',
          message: 'Select the department for the new role:',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answer.title,
            salary: answer.salary,
            department_id: answer.department_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log('Role added successfully!');
          start();
        }
      );
    });
});
}

function addEmployee() {
connection.query('SELECT * FROM role', (err, roles) => {
  if (err) throw err;

  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: "Enter the employee's first name:",
      },
      {
        name: 'last_name',
        type: 'input',
        message: "Enter the employee's last name:",
      },
      {
        name: 'role_id',
        type: 'list',
        message: "Select the employee's role:",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log('Employee added successfully!');
          start();
        }
      );
    });
});
}

function updateEmployeeRole() {
connection.query('SELECT * FROM employee', (err, employees) => {
  if (err) throw err;

  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'employee_id',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          name: 'role_id',
          type: 'list',
          message: "Select the employee's new role:",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ])
      .then((answer) => {
        connection.query(
          'UPDATE employee SET ? WHERE ?',
          [
            {
              role_id: answer.role_id,
            },
            {
              id: answer.employee_id,
            },
          ],
          (err, res) => {
            if (err) throw err;
            console.log('Employee role updated successfully!');
            start();
          }
        );
      });
  });
});
}
