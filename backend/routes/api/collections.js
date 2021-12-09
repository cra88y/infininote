const router = require("express").Router();
const db = require("../../db/models");
const asyncHandler = require("express-async-handler");
const { restoreUser } = require("../../utils/auth");
router.get(
  "/",
  restoreUser,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const collections = await db.Collection.findAll({
      where: { userid: user.id },
    });
    // console.log(notes);
    res.json(collections);
  })
);

router.delete(
  "/:id",
  restoreUser,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const collectionid = req.params.id;
    const collection = await db.Collection.findByPk(collectionid);
    if (collection) {
      collection.destroy();
      res.json("success");
    } else res.json("failed");
  })
);
router.post(
  "/",
  restoreUser,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const { name, id } = req.body;
    const collectionObj = {
      userid: user.id,
      name,
    };
    let collection = null;
    if (id) {
      collection = await db.Collection.findByPk(id);
      collection.name = name;
    } else {
      collection = await db.Collection.build(collectionObj);
    }
    await collection.save();
    if (collection) res.json(collection);
    else res.json("invalid collection");
  })
);
module.exports = router;
