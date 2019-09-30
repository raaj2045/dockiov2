const routes = require("next-routes")();
routes
  .add("/", "/index")
  .add("/upload/:address", "/upload")
  .add("/dashboard/School", "dashboard/schooldashboard")
  .add("/dashboard/Student", "dashboard/studentdashboard")
  .add("/dashboard/Company", "dashboard/companydashboard")
  .add("/student/share/:companyId", "/student/share")
  .add("/company/:companyAddress/:address", "/company/students")
  .add(
    "/company/:companyAddress/:schoolAddress/:address",
    "/company/student-single"
  );

module.exports = routes;
