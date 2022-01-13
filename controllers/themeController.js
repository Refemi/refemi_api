const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const getAllThemes = async (_, response) => {
  let themes;

  try {
    const themesQuery = "SELECT id, theme_name AS name, theme_label AS label FROM themes";
    const themesResult = await Postgres.query(themesQuery);

    if (themesResult.rows.length === 0) {
      return response.status(404).json({
        message: "There are no registered themes",
      });
    }

    themes = themesResult.rows;
  } catch (error) {
    res.status(500).json({
      error: error
    });
  }

  await response.status(200).json({
    themes: themes,
  });
};

const getTheme = async (request, response) => {
  let theme;

  try {
    const themeQuery =
      'SELECT id, "theme_name" AS name FROM "themes" WHERE LOWER("theme_name") = LOWER($1)';
    const themeArgument = [request.params.name];
    const themeResult = await Postgres.query(themeQuery, themeArgument);

    if (themeResult.rows.length === 0) {
      return response.status(404).json({
        message: "The theme cannot be found",
      });
    }

    theme = themeResult.rows[0];
  }catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error: error
    });}

  response.status(200).json({ 
  theme: theme,
  });
};

const postTheme = async (request, response) => {
  const token = request.headers["x-access-token"];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return response.status(400).json({
      message: "Problème d'identifiant",
    });
  }

  const data = jwt.decode(token);

  try {
    const { name, label } = request.body;

    if (!name && !label) {
      return response.status(400).json({
        message: "The theme name is missing",
      });
    }

    const newThemeQuery = `INSERT
      INTO "themes" ("theme_name", "theme_label", "theme_active")
      VALUES ($1, $2, $3)
    ;`;
    const newThemeArgument = [name, label, false];

    await Postgres.query(newThemeQuery, newThemeArgument);
    response.status(201).json({
      theme: {
        name,
        label
      }
    })
  } catch (error) {
    switch (error.code) {
      case "23505":
        response.status(409).json({
          message: "The theme already exists",
        });

        break;

      case "ENOTFOUND":
        response.status(500).json({
          message: "The server cannot be found",
        });

        break;

      default:
        response.status(500).json({
          message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
          error: error,
        });
    }
  }
};

const putTheme = async (request, response) => {
  let theme, newTheme;

  try {
    theme = request.params.name;
    newTheme = request.body.name;

    if (!newTheme) {
      return response.status(400).json({
        message: "The theme name is missing",
      });
    }

    const themeQuery =
      'SELECT theme_name AS name FROM "themes" WHERE theme_name = $1';
    const themeArgument = [theme];

    const themeResult = await Postgres.query(themeQuery, themeArgument);

    if (themeResult.rows === 0) {
      return response.status(404).json({ 
        message: "The theme cannot be found",
      });
    }
  }catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error: error
    });}
};

const deleteTheme = async (request, response) => {
  try {
    const themeQuery =
      'DELETE FROM "themes" WHERE LOWER("theme_name") = LOWER($1)';
    const themeArgument = [request.params.name];
    const themeResult = await Postgres.query(themeQuery, themeArgument);

    if (themeResult.rowCount === 0) {
      return response.status(404).json({
        message: "The theme cannot be found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error: error
    });}

  response.status(200).json({
    theme: request.params.name,
  });
};

module.exports = {
  getTheme,
  getAllThemes,
  postTheme,
  putTheme,
  deleteTheme,
};
