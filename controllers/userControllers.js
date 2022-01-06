const jwt = require("jsonwebtoken");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const passwordValid = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,50})$/;

const newUser = catchAsyncErrors(async (req, res,next) => {
  const { name, mail, password } = req.body;
  // Regex : needs at least a number and 6 characters
  const passwordTest = passwordValid.test(password);
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
    }
  
});

const checkUser = catchAsyncErrors(async(req, res, next) => {
  const { mail, password } = req.body;

    const user = await Postgres.query(
      'SELECT * FROM "users" WHERE user_mail= $1',
      [mail]
    );

    if (user.rows.length === 0) {
       return next(new ErrorHander("Invalid Credential", 401));
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
       return next(new ErrorHander("Invalid Credential", 401));
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
 
});


module.exports = { newUser, checkUser,};

