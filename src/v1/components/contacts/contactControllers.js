const { Mailer } = require("./contact");

/**
 * @description Contacts Class
 */
class Contacts {
  /**
   * Send a new contact mail
   * @route POST /contacts
   * @param {string} request.params.username - Name of the user
   * @param {string} request.params.mail - Mail of the user
   * @param {string} request.params.message - Message of the user
   */
  async addOne (request, response, next) {
    try {
      const { username, email, message } = request.body;
      const error = Mailer.send(username, email, message);

      if (error) {
        throw error;
      }

      response.status(201).json({
        message: "Message sent"
      });
    } catch (error) {
      next(error);
    }
  }
}


module.exports = new Contacts();
