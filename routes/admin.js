const router = require("express").Router();
const validate = require("./dataValidation");
const jwt = require("jsonwebtoken");
const auth = require("./authorization");
const cors = require("../extras/corsFix");

router.post("/login", cors, async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  console.log(data);
  if (validate.adminLogin(data).isValid) {
    const accessToken = jwt.sign(
      { email: data.email },
      process.env.ADMIN_TOKEN_SECRET
    );
    res.json({ authorized: true, accessToken });
  } else {
    res.json({
      type: "error",
      msg: validate.adminLogin(data).msg,
    });
  }
});

router.get("/verifyToken", cors, auth.admin, (req, res) => {
  res.json({ authorized: true });
});

module.exports = router;
