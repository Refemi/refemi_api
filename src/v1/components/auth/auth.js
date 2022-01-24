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
  constructor(
    userName = undefined,
    userEmail = undefined,
    userId = undefined,
    userRole = "user",
    userPassword = undefined,
  ) {
    this.userName = userName;
    this.userEmail = userEmail;
    this.userId = userId;
    this.userRole = userRole;
    this.userPassword = userPassword;
  }
  /**
   * Checks the user credentials
   * @param {string} password
   * @returns {boolean}
   */
  async checkCredentials(password) {
    return await bcrypt.compare(password, this.userPassword);
  }
  /**
   * Generates a new token
   * @returns {string} token
   */
  getNewToken() {
    return jwt.sign(
      {
        id: this.userId,
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
      userName: this.userName,
      userEmail: this.userEmail,
      userRole: this.userRole,
    };
  }
  /**
   * Generate a new hashed password
   * @param {string} password 
   * @returns {string} hashed password
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }
}

module.exports = {
  User,
};
