const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Errors Route
const { ErrorSectionNotFound } = require("./sectionsErrors");

/**
 * @description CRUD Sections Class
 * @class Controler
 * @extends {Postgres}
 */
class Sections {
  /** 
   * @description Get all sections
   * @route GET api/v1/sections
   */
  async getAll (_, response, next) {
    try {
      const sectionsQuery =`
        SELECT
          id, section_name AS name, section_label AS label
        FROM sections
      `;
      const sectionsResult = await Postgres.query(sectionsQuery);
  
      if (sectionsResult.rows.length === 0) {
          return next(new ErrorSectionNotFound())
      }
  
      const sections = sectionsResult.rows;
  
      await response.status(200).json({ sections });
    } catch (error) {
      next(error);
    }
  };
  /** 
   * @description Get one section
   * @route GET /section/:id
   */
  async getOne (request, response, next) {
    // TODO: Get one section
    response.status(200).json({
      messsage: "Need to do",
    });
  };
  /**
   * @description Add one section
   * @route GET api/v1/sections
   * @param {String} request.body.name
   * @param {String} request.body.label
   */
  async addOne (request, response, next) {
    // TODO: Create a section
    response.status(201).json({
      message: "Need to do"
    });
  };
  /**
   * @description Update one section 
   * @route PUT api/v1/sections/:id
   * @param {String} request.body.name
   * @param {String} request.body.label
   * @param {String} request.body.section
   * @param {Boolean} request.body.active //TODO: Add active field
   */
  async updateOne (request, response, next) {
    // TODO: Update a category
    response.status(200).json({
      message: "Need to do"
    });
  };
  /** 
   * @description Delete one section
   * @route DELETE api/v1/sections/:id
   */
  async deleteOne (request, response, next) {
    // TODO: Delete a category
    response.status(200).json({
      messsage: "Need to do"
    });
  };
}

module.exports = new Sections();