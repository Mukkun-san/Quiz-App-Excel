const jwt = require("jsonwebtoken");

exports.admin = (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    console.log("No access token received");
    res.sendStatus(401);
  } else {
    jwt.verify(accessToken, process.env.ADMIN_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("Access token could not be verified");
        res.sendStatus(401);
      } else {
        console.log("Access token verified");
        next();
      }
    });
  }
};

exports.student = (req, res, next) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    res.status(403).json({ error: "No access token sent to the server" });
  } else {
    jwt.verify(accessToken, process.env.STUDENT_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("Access token could not be verified");
        res.status(403).json({
          error: "Unauthorized Access",
        });
      } else {
        console.log("Access token verified");
        next();
      }
    });
  }
};
