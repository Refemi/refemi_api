const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  ErrorHandler,
  ErrorUserPassword,
} = require("./authErrors");

/**
 * @description User Auth Class
 * @param {string} userName
 * @param {string} userEmail
 * @param {string} userId
 * @param {string} userPassword
 * @param {string} userRole
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
  /**
   * Returns the user object
   * @return {string} credentials.userName
   * @return {string} credentials.userEmail
   * @return {string} credentials.userRole
   */
  getCredentials() {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
  /**
   * Generate a new hashed password
   * @param {string} password 
   * @returns {string} hashed password
   */
  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }
}

module.exports = {
  User,
};
