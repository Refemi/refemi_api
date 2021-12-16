const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});

const referencesRouter = require("./routers/referencesRouter");
const loginRouter = require("./routers/loginRouter");
const registerRouter = require("./routers/registerRouter");
const counterRouter = require("./routers/counterRouter");
const adminRouter = require("./routers/adminRouter");
const categoriesRouter = require("./routers/categoriesRouter");
const themesRouter = require("./routers/themesRouter");
const searchRouter = require("./routers/searchRouter");
const contactRouter = require("./routers/contactRouter");

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.json());

app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/references", referencesRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/counter", counterRouter);
app.use("/categories", categoriesRouter);
app.use("/admin", adminRouter);
app.use("/themes", themesRouter);
app.use("/search", searchRouter);
app.use("/contact", contactRouter);

app.listen(process.env.APIPORT, () => {
  console.log(`Listening on port ${process.env.APIPORT}`);
});
