// const data = {
//   employees: require("../model/employees.json"),
//   setEmployees: function (data) {
//     this.employees = data;
//   },
// };

// const fs = require("fs");
// const path = require("path");
// const employeesFilePath = path.join(__dirname, "../model/employees.json");

// const getEmployeesFromFile = () => {
//   try {
//     const employeesData = fs.readFileSync(employeesFilePath, "utf8");
//     return JSON.parse(employeesData) || [];
//   } catch (error) {
//     console.error("Error reading or parsing employees.json:", error);
//     return [];
//   }
// };

// const writeEmployeesToFile = (data) => {
//   try {
//     fs.writeFileSync(employeesFilePath, JSON.stringify(data, null, 2));
//   } catch (error) {
//     console.error("Error writing to employees.json:", error);
//   }
// };

const Employee = require("../model/Employee");
const mongoose = require("mongoose");

const getAllEmployees = async (req, res) => {
  console.log("GET /employees hit");
  try {
    const employees = await Employee.find().sort({ _id: 1 });
    if (!employees.length) {
      console.log("No employees found.");
      return res.status(404).json({ message: "No employees found" });
    }
    const formattedEmployees = employees.map((employee, index) => ({
      isd: index + 1,
      _id: employee._id,
      firstname: employee.firstname,
      lastname: employee.lastname,
    }));
    return res.json(formattedEmployees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createNewEmployee = async (req, res) => {
  // const employees = getEmployeesFromFile();
  if (!req.body.firstname || !req.body.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required." });
  }

  // const newEmployee = {
  //   id: employees?.length ? employees[employees.length - 1].id + 1 : 1,
  //   firstname: req.body.firstname,
  //   lastname: req.body.lastname,sess
  // };
  const newEmployee = new Employee({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
  await newEmployee.save();

  // const updatedEmployees = [...employees, newEmployee];
  // writeEmployeesToFile(updatedEmployees);
  res.status(201).json(newEmployee);
};

const updateEmployee = async (req, res) => {
  const { _id, firstname, lastname } = req.body;

  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Valid ID parameter is required." });
  }
  try {
    // Find the employee
    // let employees = getEmployeesFromFile();
    // const index = employees.findIndex(
    //   (emp) => emp.id === parseInt(req.body.id)
    // );
    // if (index === -1) {
    //   return res
    //     .status(400)
    //     .json({ message: `Employee ID ${req.body.id} not found` });
    // }

    const employee = await Employee.findById(_id);
    if (!employee) {
      return res
        .status(204)
        .json({ message: `No employee matches ID ${req.body._id}.` });
    }
    // employees[index] = { ...employees[index], ...req.body };
    // writeEmployeesToFile(employees);

    if (firstname) employee.firstname = firstname;
    if (lastname) employee.lastname =   lastname;
    await employee.save();
    res.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteEmployee = async (req, res) => {
  // let employees = getEmployeesFromFile();
  // const employeeIndex = employees.findIndex(
  //   (emp) => emp.id === parseInt(req.params.id)
  // );

  // if (employeeIndex === -1) {
  //   return res
  //     .status(400)
  //     .json({ message: `Employee ID ${req.body.id} not found` });
  // }
  const _id = req.params._id;
  console.log(`Received ID: ${_id}`);
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid ObjectId format" });
  }

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(_id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // employees.splice(employeeIndex, 1);
    // employees = employees.map((emp, index) => ({
    //   ...emp,
    //   id: index + 1, // Assign new sequential ID
    // }));
    // writeEmployeesToFile(employees);

    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};
