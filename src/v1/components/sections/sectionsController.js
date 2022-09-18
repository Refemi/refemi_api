const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Errors Route
const { ErrorSectionNotFound } = require("./sectionsErrors");

/**
 * @description CRUD Sections Class
 */
class Sections {
  /**
   * @description Get all sections
   * @route GET api/v1/sections
   */
  async getAllSections(_, response, next) {
    try {
      const sectionsQuery = `
        SELECT
          id, section_name AS name, section_label AS label, activated
        FROM sections
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
  /**
   * @description Get one section
   * @route GET /section/:id
   */
  async getOneSection(_request, response) {
    // TODO: Get one section
    response.status(200).json({
      messsage: "Need to do",
      sections,
    });
  }
  /**
   * @description Add one section
   * @route GET api/v1/sections
   * @param {string} request.body.name
   * @param {string} request.body.label
   */
  async addOneSection(_request, response) {
    // TODO: Create a section
    response.status(201).json({
      message: "Need to do",
      sections,
    });
  }
  /**
   * @description Update one section
   * @route PUT api/v1/sections/:id
   * @param {string} request.body.name
   * @param {string} request.body.label
   * @param {string} request.body.section
   * @param {boolean} request.body.active //TODO: Add active field
   */
  async updateOneSection(_request, response) {
    // TODO: Update a section
    response.status(200).json({
      message: "Need to do",
      sections,
    });
  }
  /**
   * @description Delete one section
   * @route DELETE api/v1/sections/:id
   */
  async deleteOneSection(_request, response) {
    // TODO: Delete a section
    response.status(200).json({
      messsage: "Need to do",
      sections,
    });
  }
}

module.exports = new Sections();
