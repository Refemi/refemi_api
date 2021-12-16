const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const killCookie = require("../utils/killCookie");
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
        message: `New user ${mail} has been createded`,
      });
    } else {
      return res.status(400).json({
        message: "information is not matched.",
      });
    }
  } catch (err) {
    res.status(500).json(err);
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
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      id: user.rows[0].id,
      name: user.rows[0].user_name,
      mail: user.rows[0].user_mail,
      role: user.rows[0].user_role,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

const modifyUser = async (req, res) => {
  const userId = req.cookies.jwtData.id;
  const updateValue = req.body;

  try {
    const updateTodo = await Postgres.query(
      'UPDATE "users" SET $1 = $2 WHERE "id" = $3',
      [updateValue, userId]
    );

    res.json("user  updated!");
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
};
const logout = async (req, res) => {
  res.clearCookie("jwt").status(200).json({ message: "You are logout" });
};

module.exports = { newUser, checkUser, logout, modifyUser };
