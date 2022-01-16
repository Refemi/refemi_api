const nodemailer = require("nodemailer");

const { ErrorNodeMailService, ErrorMailData } = require("./contactErrors");

const service = process.env.NODEMAILER_SERVICE

class Contacts {
  constructor () {
    this.node = nodemailer.createTransport({
      service: service,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      }
    });

    this.verify()
  }

  verify = () => {
    this.node.verify((error) => {
      if (error) {
        return new ErrorNodeMailService(error)
      }
    })
  }

  send = (username, email, message) => {
    if (!username || !email || !message) {
      return new ErrorMailData({ username, email, message })
    }

    const mail = {
      from: this.username,
      to: process.env.NODEMAILER_EMAIL,
      subject: 'Formulaire de contact',
      html: `
        <p>Nom: ${this.username}</p>
        <p>Email: ${this.email}</p>
        <p>Message: ${this.message}</p>
      `
    };

    this.node.sendMail(mail, (error) => {
      if (error) {
        throw (ErrorNodeMailService(error))
      }
    })
  }
}

module.exports = Contacts()