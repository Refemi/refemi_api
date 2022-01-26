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
  constructor(name, email, password = "", id = -1, role = -1) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
  /**
   * Checks the user credentials
   * @param {string} password
   * @returns {boolean}
   */
  async checkCredentials(password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    console.log(isPasswordValid)
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
  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }
}

module.exports = {
  User,
};
