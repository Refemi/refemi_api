const express = require("express");
const app = express();
const cors = require("cors");

const errorMiddleware = require("./middlewares/error");

const corsOptions = {
  origin: "http://localhost:3000",
};


app.use(express.json());
app.use(cors(corsOptions));


// Route Imports
const referencesRouter = require("./components/references/routers/referencesRouter");
const loginRouter = require("./components/user/routers/loginRouter");
const registerRouter = require("./components/user/routers/registerRouter");
const counterRouter = require("./components/counter/routers/counterRouter");
const adminRouter = require("./components/admin/routers/adminRouter");
const categoriesRouter = require("./components/categories/routers/categoriesRouter");
const themesRouter = require("./components/theme/routers/themesRouter");
const searchRouter = require("./components/search/routers/searchRouter");
const contactRouter = require("./components/contact/contactRouter");

app.use("/references", referencesRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/counter", counterRouter);
app.use("/categories", categoriesRouter);
app.use("/admin", adminRouter);
app.use("/themes", themesRouter);
app.use("/search", searchRouter);
app.use("/contact", contactRouter);

// Middleware for Errors
app.use(errorMiddleware)

module.exports = app;