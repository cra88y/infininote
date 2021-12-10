const router = require("express").Router();
const db = require("../../db/models");
const asyncHandler = require("express-async-handler");
const { restoreUser } = require("../../utils/auth");
router.get(
  "/",
  restoreUser,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const notes = await db.Note.findAll({ where: { userid: user.id } });
    // console.log(notes);
    res.json(notes);
  })
);

router.delete(
  "/:id",
  restoreUser,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const noteid = req.params.id;
    const note = await db.Note.findByPk(noteid);
    if (note) note.destroy();
    res.json("success");
  })
);
router.post(
  "/",
  restoreUser,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const { title, content, id, collectionid } = req.body;
    const noteObj = {
      userid: user.id,
      collectionid,
      title,
      content,
    };
    let note = null;

    if (id) {
      note = await db.Note.findByPk(id);
      note.collectionid = collectionid;
      note.title = title;
      note.content = content;
    } else {
      note = await db.Note.build(noteObj);
    }
    console.log(note.collectionid);
    await note.save();
    if (note) res.json(note);
    else res.json("invalid note");
  })
);
module.exports = router;
