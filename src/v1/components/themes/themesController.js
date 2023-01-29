const { Pool } = require("pg");
const Postgres = new Pool();

const {
  ErrorHandler,
  ErrorThemesExist,
  ErrorThemesNotFound,
} = require("./themesErrors");

class Themes {
  /**
   * Get all themes
   */
  getAllThemes = async (_, response, next) => {
    try {
      let themes;
      console.log("coucou");
      const themesQuery = `
        SELECT id, theme_name AS name, theme_label AS label FROM themes
      `;

      const themesResult = await Postgres.query(themesQuery);

      if (themesResult.rows.length === 0) {
        throw new ErrorThemesNotFound();
      }

      themes = themesResult.rows;

      await response.status(200).json({
        themes: themes,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new Themes();
