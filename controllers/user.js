// Register a user   => /api/v1/register
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.registerUser = async (req, res, next) => {
  if (req.method == "POST") {
    var post = req.body;
    var email = post.email;
    var pass = post.password;
    var fname = post.first_name;
    var lname = post.last_name;

    post.password = bcrypt.hashSync(pass, 10);
    const pw = post.password;

    if (!req.files) return res.status(400).send("No files were uploaded.");

    var file = req.files.uploaded_image;
    var img_name = file.name;

    if (
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/gif"
    ) {
      file.mv("public/images/upload_images/" + file.name, function (err) {
        if (err) return res.status(500).send(err);
        var sql =
          "INSERT INTO `users_image`(`first_name`,`last_name`,`email`, `password` ,`image`) VALUES ('" +
          fname +
          "','" +
          lname +
          "','" +
          email +
          "','" +
          pw +
          "','" +
          img_name +
          "')";

        var query = db.query(sql, function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          const token = jwt.sign(
            { _id: result.insertId },
            process.env.TOKEN_SECRET
          );
          res.cookie("token", token, {
            expires: new Date(Date.now() + 9999999),
          });
          res.redirect("profile/" + result.insertId);
          //   console.log(result);
        });
      });
    } else {
      message =
        "This format is not allowed , please upload file with '.png','.gif','.jpg'";
      res.render("index.ejs", { message: message });
    }
  } else {
    res.render("index");
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  req.redirect("/login");
};

// Get currently logged in user details
exports.getUserProfile = async (req, res, next) => {
  var message = "";
  var id = req.params.id;
  var sql = "SELECT * FROM `users_image` WHERE `id`='" + id + "'";
  db.query(sql, function (err, result) {
    if (result.length <= 0) message = "Profile not found!";

    res.render("profile.ejs", { data: result, message: message });
  });
};
