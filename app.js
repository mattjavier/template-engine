const Manager = require('./lib/Manager')
const Engineer = require('./lib/Engineer')
const Intern = require('./lib/Intern')
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')

const OUTPUT_DIR = path.resolve(__dirname, 'output')
const outputPath = path.join(OUTPUT_DIR, 'team.html')

const render = require('./lib/htmlRenderer')

// questions array for all employees
const employeeQ = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter a name:'
  }, 
  {
    type: 'number',
    name: 'id',
    message: 'Enter an ID:' 
  },
  {
    type: 'input',
    name: 'email',
    message: 'Enter an email address:'
  }
]

// extra manager question
const managerQ = {
  type: 'number',
  name: 'officeNumber',
  message: 'Enter an office number:'
}

// extra engineer question
const engineerQ = {
  type: 'input',
  name: 'github',
  message: 'Enter a GitHub username:'
}

// extra intern question
const internQ = {
  type: 'input',
  name: 'school',
  message: 'Enter a school:'
}

// initial manager count, increment if user inputs a manager
let managerCount = 0

// array of all employees added
let employees = []

// check if user wants to enter more employees
const moreEmployees = () => {
  inquirer.prompt({
    type: 'confirm',
    name: 'more',
    message: 'Do you want to add more employees?'
  })
  .then(({ more }) => {
    if (more) {

      // prompt user for more employees if they decided Y
      query()
    } else {

      // render all employees to 'team.html' 
      fs.writeFile(outputPath, render(employees), (err) => {
        if (err) { console.log(err) }
      })
    }
  })
  .catch(err => console.log(err))
}

// prompt user for manager information
const buildManager = () => {
  inquirer.prompt([...employeeQ, managerQ])
  .then(({ name, id, email, officeNumber }) => {

    // push employee to array
    employees.push(new Manager(name, id, email, officeNumber))
    
    // check if user wants to add more employees
    moreEmployees()
  })
  .catch(err => console.log(err))
}

// prompt user for engineer information
const buildEngineer = () => {
  inquirer.prompt([...employeeQ, engineerQ])
  .then(({ name, id, email, github }) => {

    // push employee to array
    employees.push(new Engineer(name, id, email, github))

    // check if user wants to add more employees
    moreEmployees()
  })
  .catch(err => console.log(err))
}

// prompt user for intern information
const buildIntern = () => {
  inquirer.prompt([...employeeQ, internQ])
  .then(({ name, id, email, school }) => {

    // push employee to array
    employees.push(new Intern(name, id, email, school))

    // check if user wants to add more employees
    moreEmployees()
  })
  .catch(err => console.log(err))
}

// ask user to enter an employee
const query = () => {
  inquirer.prompt({
    type: 'list',
    name: 'employeeType',
    message: 'Choose an employee to enter:',
    choices: ['Manager', 'Engineer', 'Intern']
  })
  .then(({ employeeType }) => {

    // check if it is a manager, engineer or intern
    switch (employeeType) {
      case 'Manager':
        // ensure no more than one manager is entered
        if (managerCount === 0) {
          managerCount++
          buildManager()
        } else {
          console.log('You already entered a manager. Please enter another team member.')
          query()
        }
      break
      case 'Engineer':
        buildEngineer()
      break
      case 'Intern':
        buildIntern()
      break
    }
  })
  .catch(err => console.log(err))
}

query()