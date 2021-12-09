const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const notesRouter = require("./notes.js");
const collectionsRouter = require("./collections.js");
router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/notes", notesRouter);

router.use("/collections", collectionsRouter);

module.exports = router;
