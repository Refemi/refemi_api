const nodemailer = require("nodemailer");
const service = process.env.NODEMAILER_SERVICE
const {
  ErrorMailData,
  ErrorNodeMailService
} = require("./contactErrors");


class Mailer {
  constructor () {
    this.node = nodemailer.createTransport({
      service: service,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      }
    });

    if (!this.verify()) {
      return new ErrorNodeMailService();
    }
  }

  verify = (_, _, next) => {
    try {
      this.node.verify((error) => {
        if (error) {
          throw new ErrorNodeMailService(error)
        }

        return false
      })
    } catch (error) {
      return error;
    }
  }
  send = (username, email, message) => {
    try {
      if (!username || !email || !message) {
        throw new ErrorMailData({ username, email, message });
      }

      const mail = {
        from: username,
        to: process.env.NODEMAILER_EMAIL,
        subject: 'Formulaire de contact',
        html: `
          <p>Nom: ${username}</p>
          <p>Email: ${email}</p>
          <p>Message: ${message}</p>
        `
      };

      this.node.sendMail(mail, (error) => {
        if (error) {
          throw ErrorNodeMailService(error);
        }
      });
    } catch (error) {
      next(error)
    }
  }
}


module.exports = { 
  Mailer
}
