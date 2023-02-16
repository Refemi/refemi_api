const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * @description User Auth Class
 * @param {string} userName
 * @param {string} userEmail
 * @param {string} userId
 * @param {string} userPassword
 * @param {string} userRole
 */
class User {
  constructor(name, email, password, id, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  /**
   * Checks the user credentials
   */
  async checkCredentials(password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    if (!isPasswordValid) {
      return false;
    }

    return true;
  }

  //Generates a new token
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
   */
  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }
}

module.exports = {
  User,
};
