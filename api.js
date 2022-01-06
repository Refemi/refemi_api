const express = require("express");
const app = express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/error");

const corsOptions = {
  origin: "http://localhost:3000",
};


app.use(express.json());
app.use(cors(corsOptions));


const referencesRouter = require("./routers/referencesRouter");
const loginRouter = require("./routers/loginRouter");
const registerRouter = require("./routers/registerRouter");
const counterRouter = require("./routers/counterRouter");
const adminRouter = require("./routers/adminRouter");
const categoriesRouter = require("./routers/categoriesRouter");
const themesRouter = require("./routers/themesRouter");
const searchRouter = require("./routers/searchRouter");
const contactRouter = require("./routers/contactRouter");





app.use("/references", referencesRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/counter", counterRouter);
app.use("/categories", categoriesRouter);
app.use("/admin", adminRouter);
app.use("/themes", themesRouter);
app.use("/search", searchRouter);
app.use("/contact", contactRouter);

app.use(errorMiddleware)

module.exports = app;