const router = require("express").Router();

const { authorize, appendToSheet, getFromSheet } = require("../sheets.js");

router.get("/", async (req, res) => {
  authorize(appendToSheet).then(async (auth) => {
    const sheetData = await getFromSheet(auth);
    res.status(200).send(JSON.stringify(sheetData));
  });
});

router.get("/:class", async (req, res) => {
  const className = req.params.class;
  authorize(appendToSheet).then(async (auth) => {
    const sheetData = await getFromSheet(auth);
    sheetData.shift();
    res.json(
      sheetData.filter((x) => {
        return x.sheet === className;
      })[0].Questions
    );
  });
});

module.exports = router;
