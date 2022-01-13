const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Errors Route
const ErrorHander = require("../../../utils/errorhander");
const catchAsyncErrors = require("../../../middlewares/catchAsyncErrors")


// get all themes
const getAllThemes = catchAsyncErrors(async(_, response,next) => {
  let themes;

    const themesQuery = "SELECT id, theme_name AS name, theme_label AS label FROM themes";
    const themesResult = await Postgres.query(themesQuery);

    if (themesResult.rows.length === 0) {
     return next(new ErrorHander("There are no registered themes", 404))
    }

    themes = themesResult.rows;
      await response.status(200).json({
        themes: themes,
      });
});


// get theme by name
const getTheme = catchAsyncErrors(async (request, response,next) => {
  let theme;

    const themeQuery =
      'SELECT id, "theme_name" AS name FROM "themes" WHERE LOWER("theme_name") = LOWER($1)';
    const themeArgument = [request.params.name];
    const themeResult = await Postgres.query(themeQuery, themeArgument);

    if (themeResult.rows.length === 0) {
      return next(new ErrorHander("The theme cannot be found", 401))
    }

    theme = themeResult.rows[0];
  response.status(200).json({ 
  theme: theme,
  });
});

// add theme
const postTheme = catchAsyncErrors(async (request, response,next) => {
  let newTheme;
    newTheme = request.body.name;

    if (!newTheme) {
       return next(new ErrorHander("The theme name is missing", 400))
    }

    const newThemeQuery = 'INSERT INTO "themes" ("theme_name") VALUES ($1)';
    const newThemeArgument = [newTheme];

    await Postgres.query(newThemeQuery, newThemeArgument);
  response.status(200).json({
    message: "ok",
    newTheme: newTheme,
  });
});
// update theme
const putTheme = catchAsyncErrors(async (request, response, next) => {
  let theme, newTheme;
    theme = request.params.name;
    newTheme = request.body.name;

    if (!newTheme) {
       return next(new ErrorHander("The theme name is missing", 400))
    }

    const themeQuery =
      'SELECT theme_name AS name FROM "themes" WHERE theme_name = $1';
    const themeArgument = [theme];

    const themeResult = await Postgres.query(themeQuery, themeArgument);

    if (themeResult.rows === 0) {
       return next(new ErrorHander( "The theme cannot be found", 404))
    }
     response.status(200).json({
    message: "ok",
  });
});
// delete theme
const deleteTheme = catchAsyncErrors(async (request, response) => {
  
    const themeQuery =
      'DELETE FROM "themes" WHERE LOWER("theme_name") = LOWER($1)';
    const themeArgument = [request.params.name];
    const themeResult = await Postgres.query(themeQuery, themeArgument);

    if (themeResult.rowCount === 0) {
       return next(new ErrorHander("The theme cannot be found", 404))
    }
 
  response.status(200).json({
    theme: request.params.name,
  });
});

module.exports = {
  getTheme,
  getAllThemes,
  postTheme,
  putTheme,
  deleteTheme,
};


