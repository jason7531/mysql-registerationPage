const express = require("express");
const router = express.Router();
const User = require("../core/user");
const user = new User();
const controller = require("../controllers/user");

const { isVerified } = require("../middlewares/verifyToken");

router.get("/", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register", controller.registerUser);
router.post("/login", (req, res, next) => {
  user.login(req.body.email, req.body.password, function (result) {
    if (result) {
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.cookie("token", token, { expires: new Date(Date.now() + 9999999) });
      res.redirect("/me");
    } else {
      // if the login function returns null send this error message back to the user.
      res.send("Username/Password incorrect!");
    }
  });
});

router.get("/logout", controller.logout);

module.exports = router;
