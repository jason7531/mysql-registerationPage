const pool = require("./pool");
const bcrypt = require("bcrypt");

function User() {}

User.prototype = {
  find: function (user = null, callback) {
    if (user) {
      var field = Number.isInteger(user) ? "id" : "email";
    }
    // prepare the sql query
    let sql = `SELECT * FROM users_image WHERE ${field} = ?`;

    pool.query(sql, user, function (err, result) {
      if (err) throw err;

      if (result.length) {
        callback(result[0]);
      } else {
        callback(null);
      }
    });
  },

  login: function (email, password, callback) {
    // find the user data by his username.
    this.find(email, function (user) {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          callback(user);
          return;
        }
      }
      callback(null);
    });
  },
};

module.exports = User;
