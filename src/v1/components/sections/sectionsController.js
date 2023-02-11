const { Pool } = require("pg");
const Postgres = new Pool();

// Errors Route
const { ErrorSectionNotFound } = require("./sectionsErrors");

class Sections {
  /**
   * @description Get all sections
   */
  async getAllSections(_, response, next) {
    try {
      const sectionsQuery = `
        SELECT
          id, section_name AS name, section_label AS label
        FROM sections
        WHERE is_active = true
      `;
      const sectionsResult = await Postgres.query(sectionsQuery);

      if (sectionsResult.rows.length === 0) {
        return next(new ErrorSectionNotFound());
      }

      const sections = sectionsResult.rows;

      await response.status(200).json({
        sections,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Sections();
