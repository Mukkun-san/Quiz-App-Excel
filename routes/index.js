const router = require("express").Router();

const admin = require("./admin");
const student = require("./student");
const sheets = require("./sheets");

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

router.use("/admin", admin);
router.use("/student", student);
router.use("/sheets", sheets);

module.exports = router;
