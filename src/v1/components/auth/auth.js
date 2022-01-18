const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * @description User Auth Class
 * @param {string} User.id
 * @param {string} User.name
 * @param {string} User.mail
 * @param {string} User.password
 * @param {string} User.role
 */
class User {
  constructor(User) {
    this.id = User.id;
    this.name = User.user_name;
    this.email = User.user_mail;
    this.password = User.user_password;
    this.role = User.user_role;
  }
  /**
   * Checks the user credentials
   * @param {string} password
   * @returns {boolean}
   */
  async checkCredentials(password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);

    if (!isPasswordValid) {
      return false;
    }

    return true;
  }
  /**
   * Generates a new token
   * @returns {string} token
   */
  getNewToken() {
    return jwt.sign(
      {
        id: this.id,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 86400,
      }
    );
  }
}

module.exports = {
  User,
};
