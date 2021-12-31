const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const passwordValid = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,50})$/;

const newUser = async (req, res) => {
  const { name, mail, password } = req.body;
  // Regex : needs at least a number and 6 characters
  const passwordTest = passwordValid.test(password);

  try {
    const user = await Postgres.query(
      'SELECT * FROM "users" WHERE "user_mail" = $1',
      [mail]
    );

    if (user.rows.length === 0 && passwordTest) {
      const salt = await bcrypt.genSalt(12);
      const bcryptPassword = await bcrypt.hash(password, salt);

      await Postgres.query(
        'INSERT INTO "users" ("user_name", "user_mail", "user_password") VALUES ($1, $2, $3)',
        [name, mail, bcryptPassword]
      );

      return res.status(201).json({
        message: `New user has been createded`,
      });
    } else {
      return res.status(400).json({
        message: "the information does not match.",
      });
    }
  } catch (errors) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error: errors
    });
  }
};

const checkUser = async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await Postgres.query(
      'SELECT * FROM "users" WHERE user_mail= $1',
      [mail]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid Credential",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid credentials!",
      });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).json({
      userId: user.rows[0].id,
      userName: user.rows[0].user_name,
      userEmail: user.rows[0].user_mail,
      userRole: user.rows[0].user_role,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({
       message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
       error: error
    });
  }
};


module.exports = { newUser, checkUser,};
