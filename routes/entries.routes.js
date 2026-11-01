const router = require("express").Router();
const Entry = require("../models/Entry.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/", async (req, res) => {
  const entries = await Entry.find({ isPublic: true }).sort({ createdAt: -1 });
  res.render("entry/all-entries.ejs", { entries });
});

router.get("/new", isSignedIn, (req, res) => {
  res.render("entry/entry.ejs", { entry: {} });
});

router.post("/", isSignedIn, async (req, res) => {
  console.log(req.session.user);
  const { title, entryBody } = req.body;

  await Entry.create({
    title,
    entryBody,
    isPublic: req.body.isPublic === "on",
    owner: req.session.user._id,
  });

  res.redirect("/my-entries");
});

router.get("/:entryId/edit", isSignedIn, async (req, res) => {
  const entry = await Entry.findOne({
    _id: req.params.entryId,
    owner: req.session.user._id,
  });

  if (!entry) return res.redirect("/entries");
  res.render("entry/edit-entry.ejs", { entry });
});

router.post("/:entryId/edit", isSignedIn, async (req, res) => {
  await Entry.findOneAndUpdate(
    { _id: req.params.entryId, owner: req.session.user._id },
    {
      title: req.body.title,
      entryBody: req.body.entryBody,
      isPublic: req.body.isPublic === "on",
    },
    { runValidators: true }
  );

  res.redirect("/my-entries");
});

router.post("/:entryId/delete", isSignedIn, async (req, res) => {
  await Entry.findOneAndDelete({
    _id: req.params.entryId,
    owner: req.session.user._id,
  });

  res.redirect("/entries");
});

module.exports = router;