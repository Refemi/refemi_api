const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const {
  ErrorHandler,
  ErrorThemesExist,
  ErrorThemesNotFound
} = require('./themesErrors')

/**
  * @description CRUD for themes
  */
class Themes {
  /**
   * Get all themes
   * @route GET /themes
   */
  getAll = async (_, response) => {
    try {
      let themes;

      const themesQuery = `
        SELECT id, theme_name AS name, theme_label AS label FROM themes
      `;

      const themesResult = await Postgres.query(themesQuery);

      if (themesResult.rows.length === 0) {
        throw new ErrorThemesNotFound();
      }

      await response.status(200).json({
        themes: themesResult.rows,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * Get theme
   * @route GET /themes/:id
   * @return {object} theme
   */
  getOne = async (request, response, next) => {

    try {
      const themeQuery =`
        SELECT id, "theme_name" AS name FROM "themes" WHERE LOWER("theme_name") = LOWER($1)
      `;
      const themeArgument = [request.params.name];
      const themeResult = await Postgres.query(themeQuery, themeArgument);

      const theme = themeResult.rows[0];

      response.status(200).json({
        theme: theme
      });
    } catch (error){
      console.log(error)
    }
  };
  /**
   * Add a new theme
   * @route POST /themes/:id
   */
  addOne = async (request, response, next) => {
    try {
      let newTheme = request.body.name;

      if (!newTheme) {
        throw new ErrorHandler("The theme name is missing", 400);
      }

      const newThemeQuery = 'INSERT INTO "themes" ("theme_name") VALUES ($1)';
      const newThemeArgument = [newTheme];

      await Postgres.query(newThemeQuery, newThemeArgument);

      response.status(200).json({
        theme: theme,
      });
    } catch (error) {
      // TODO: Check if the error returned concerns a duplication
      next(error)
    }
  };
  /**
   * Update theme
   * @route PUT /themes/:id
   */
  updateOne = async (request, response, next) => {
    try {
      const { id } = request.params;
      const { name } = request.body;

      const themeQuery =
        'SELECT theme_name AS name FROM "themes" WHERE theme_name = $1';
      const themeArgument = [id, name];

      const themeResult = await Postgres.query(themeQuery, themeArgument);

      // TODO: Return the theme created in the answer
      response.status(200).json({
        theme: themeResult.rows[0],
      });
    } catch (error) {
      next(error)
    }
  };
  /**
   * Delete theme
   * @route DELETE /themes/:id
   */
  deleteOne = async (request, response) => {
    
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
  };
}


module.exports = new Themes();
