const Service = require("./contactServices");

/**
 * @description Contacts Class
 * @class Controler
 * @extends {Postgres}
 */
class Contacts {
  /**
   * Send a new contact mail
   * @route POST /contacts
   * @param {String} request.params.username - Name of the user
   * @param {String} request.params.mail - Mail of the user
   * @param {String} request.params.message - Message of the user
   */
  async addOne (request, response, next) {
    try {
      const { username, email, message } = request.body;
      const error = Service.send(username, email, message);

      if (error) {
        throw (error);
      }

      return response.status(201).json({
        message: "Message sent"
      })
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new Contacts();
