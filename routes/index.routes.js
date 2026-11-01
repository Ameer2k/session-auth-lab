const router = require("express").Router()
const Entry = require("../models/Entry.js");
const isSignedIn = require("../middleware/is-signed-in.js");


router.get('/',(req,res)=>{
    res.render('homepage.ejs')
})

router.get("/my-entries", isSignedIn, async (req, res) => {
  const entries = await Entry.find({ owner: req.session.user._id }).sort({
    createdAt: -1,
  });
  res.render("entry/my-entries.ejs", { entries });
});

module.exports = router;
