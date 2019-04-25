var db = require("mongodb").Db;
var Server = require("mongodb").Server;
var BSON = require("mongodb").BSON;
var ObjectID = require("mongodb").ObjectID;
var Connection = require("mongodb").Connection;
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const collectionName = "employees";

EmployeeProvider = function(host, port, dbname) {
  url = `mongodb://${host}:${port}`;
  MongoClient.connect(url, function(error, client) {
    assert.equal(null, error);
    console.log("Connected successfully to server");
    db = client.db(dbname);

    db.createCollection("employees", function(error, result) {
      if (error) throw error;
      console.log("Collection is created!");
    });
  });
};

EmployeeProvider.prototype.getCollection = function(callback) {
  db.collection(collectionName, function(error, employee_collection) {
    if (error) callback(error);
    else callback(null, employee_collection);
  });
};

EmployeeProvider.prototype.findAll = function(callback) {
  db.collection(collectionName, function(error, employee_collection) {
    if (error) callback(error);
    else {
      employee_collection.find().toArray(function(error, results) {
        if (error) callback(error);
        else callback(null, results);
      });
    }
  });
};

EmployeeProvider.prototype.findById = function(employeeId, callback) {
  db.collection(collectionName, function(error, employee_collection) {
    if (error) callback(error);
    else {
      employee_collection.findOne(
        {
          _id: employeeId
        },
        function(error, result) {
          if (error) callback(error);
          else callback(null, result);
        }
      );
    }
  });
};

EmployeeProvider.prototype.update = function(employeeId, employees, callback) {
  db.collection(collectionName, function(error, employee_collection) {
    if (error) callback(error);
    else {
      employee_collection.update(
        {
          _id: employeeId
        },
        employees,
        function(error, employees) {
          if (error) callback(error);
          else callback(null, employees);
        }
      );
    }
  });
};

EmployeeProvider.prototype.save = function(employee, callback) {
  db.collection(collectionName, function(error, employee_collection) {
    if (error) callback(error);
    else {
      if (typeof employees.length == "undefined") employees = [employees];
      for (var i = 0; i < employees.length; i++) {
        employee = employees[i];
        employee.created_at = new Date();
      }
      employee_collection.insertOne(employees, function() {
        callback(null, employees);
      });
    }
  });
};

EmployeeProvider.prototype.delete = function(employeeId, callback) {
  db.collection(collectionName, function(error, employee_collection) {
    if (error) callback(error);
    else {
      employee_collection.deleteOne(
        {
          _id: employeeId
        },
        function(error, employee) {
          if (error) callback(error);
          else callback(null, employee);
        }
      );
    }
  });
};

exports.EmployeeProvider = EmployeeProvider;
