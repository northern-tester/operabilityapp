var express = require("express"),
  routes = require("./routes"),
  user = require("./routes/users"),
  http = require("http"),
  path = require("path"),
  favicon = require("serve-favicon"),
  bodyParser = require("body-parser"),
  EmployeeProvider = require("./db/employeeprovider").EmployeeProvider;

var app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("view options", { layout: false });
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("stylus").middleware(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "public")));

var employeeProvider = new EmployeeProvider("localhost", 27017, "employee_db");

app.get("/", function(req, res) {
  employeeProvider.findAll(function(error, employees) {
    res.render("index", {
      title: "Employees",
      employees: employees
    });
  });
});

app.get("/employee/new", function(req, res) {
  res.render("employee_new", {
    title: "New Employee"
  });
});

app.post("/employee/new", function(req, res) {
  employeeProvider.save(
    {
      title: req.params.title,
      name: req.params.name
    },
    function(error, docs) {
      res.redirect("/");
    }
  );
});

app.get("/employee/edit/:_id", function(req, res) {
  employeeProvider.findById(req.params._id, function(error, employee) {
    res.render("employee_edit", {
      employee: employee
    });
  });
});

app.post("/employee/edit/:_id", function(req, res) {
  employeeProvider.update(
    req.params._id,
    {
      title: req.params.title,
      name: req.params.name
    },
    function(error, docs) {
      res.redirect("/");
    }
  );
});

app.post("/employee/delete/:_id", function(req, res) {
  employeeProvider.delete(req.params._id, function(error, docs) {
    res.redirect("/");
  });
});

app.listen(3000);
