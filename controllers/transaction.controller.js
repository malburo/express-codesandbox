let db = require("../db.js");
const shortid = require("shortid");

module.exports.index = (req, res) => {
  res.render("transactions/index", {
    transactions: db.get("transactions").value()
  });
};

module.exports.create = (req, res) => {
  res.render("transactions/create", {
    users: db.get("users").value(),
    books: db.get("books").value()
  });
};
module.exports.postCreate = (req, res) => {
  console.log(req.body);
  if (req.body.userId === "Choose...") {
    let id = shortid.generate();
    let userId = req.body.userId;
    let bookId = req.body.bookId;
    let userName = db
      .get("users")
      .find({ id: userId })
      .value().name;
    let bookTitle = db
      .get("books")
      .find({ id: bookId })
      .value().title;
    let isComplete = false;
    let transaction = { id, userId, bookId, userName, bookTitle, isComplete };
    db.get("transactions")
      .push(transaction)
      .write();
    res.redirect("/transactions");
  } else {
    res.redirect("/transactions/create");
  }
};
module.exports.complete = (req, res) => {
  let errors = [];
  let result = db
    .get("transactions")
    .find({ id: req.params.id })
    .value();
  if (result) {
    let id = req.params.id;
    db.get("transactions")
      .find({ id: id })
      .assign({ isComplete: true })
      .write();
    res.redirect("/transactions");
  } else {
    errors.push("Id không tồn tại");
    res.render("errors", {
      errors: errors
    });
  }
};
