const router = require("express").Router();

const admin = require("./admin");
const student = require("./student");
const sheets = require("./sheets");

router.use("/admin", admin);
router.use("/student", student);
router.use("/sheets", sheets);

module.exports = router;
