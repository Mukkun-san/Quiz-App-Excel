const router = require("express").Router();
const validate = require("./dataValidation");
const Student = require("../mongodb/schemas/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorize = require("./authorization");

//--------- BEGIN- Admin Requests ----------//
router.delete("/:_id", authorize.admin, async (req, res) => {
  const _id = req.params._id;
  const student = await Student.findOne({ _id });
  Student.deleteOne({ _id })
    .then((result) => {
      console.log(result);
      if (result.deletedCount) {
        res.json({
          type: "success",
          msg: `Student "${student.name}" was deleted from class "${student.class}"`,
        });
      } else {
        res.json({
          type: "error",
          msg: `Student could not be deleted."`,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ msg: `Failed to delete user "${name}"` });
    });
});

router.post("/confirm", authorize.admin, async (req, res) => {
  const _id = req.body._id;
  try {
    let student = await Student.findOne({ _id });
    if (student) {
      student.addedOn = Date.now();
      student.confirmed = true;
      let doc = await student.save();
      console.log(doc);
      res.json({
        type: "success",
        msg: `Student "${doc.name}" was just added to class "${doc.class}"`,
      });
    } else {
      res.json({ type: "error", msg: `Student could not be added.` });
    }
  } catch (error) {
    res.json({ type: "error", msg: `Internal Server Error` });
  }
});

router.get("/all", authorize.admin, (req, res) => {
  Student.find()
    .sort({ fullName: 1 })
    .exec()
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      res.status(500).json({ type: "error", msg: "Internal server error." });
    });
});

//--------- END- Admin Requests ----------//

//--------- BEGIN Student Requests ----------//

router.post("/signup", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const data = {
    name: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    class: req.body.class,
  };
  if (validate.studentSignup(data).isValid) {
    try {
      let student = await Student.findOne({ email: data.email });
      if (student) {
        if (student.confirmed) {
          res.json({
            type: "warning",
            msg:
              'Already joined class "' +
              student.class +
              '". Try to login instead.',
          });
        } else {
          res.json({
            type: "warning",
            msg:
              'You requested to joined class "' +
              student.class +
              '".\nWait for the admin to accept your request.',
          });
        }
      } else {
        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);
        data.addedOn = Date.now();
        student = new Student(data);
        await student.save();
        res.json({
          type: "success",
          msg: "Request to join the class has been sent.",
        });
      }
    } catch (error) {
      res.json({
        type: "error",
        errors: null,
        msg: "Internal Server Error",
      });
    }
  } else {
    res.json({
      type: "error",
      errors: validate.studentSignup(data).errors,
      msg: "Invalid data",
    });
  }
});

router.post("/login", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  const data = {
    email: req.body.email,
    password: req.body.password,
  };
  if (validate.studentLogin(data).isValid) {
    let student = await Student.findOne({ email: data.email });
    if (student) {
      if (await bcrypt.compare(data.password, student.password)) {
        if (student.confirmed) {
          const accessToken = jwt.sign(
            { email: student.email },
            process.env.STUDENT_TOKEN_SECRET
          );
          res.json({ authorized: true, accessToken, ...student._doc });
        } else {
          res.json({
            authorized: false,
            msg: `Your request to join class "${student.class}" is still pending.`,
          });
        }
      } else {
        res.json({
          authorized: false,
          msg: "Password is incorrect.",
        });
      }
    } else {
      res.json({
        type: "warning",
        msg: "Email not registered.",
      });
    }
  } else {
    res.status(403).json({
      type: "error",
      errors: validate.studentLogin(data).errors,
      msg: "Invalid Credentials",
    });
  }
});

router.get("/class", authorize.student, (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ auth: "" });
});

router.get("/verifyToken", authorize.student, (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ authorized: true });
});

//--------- END Student Requests ----------//

module.exports = router;
