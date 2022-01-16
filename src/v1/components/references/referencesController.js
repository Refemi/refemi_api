const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const jwt = require("jsonwebtoken");

const {
  ErrorReferenceNotFound
} = require("./referencesErrors");

/**
 * @description CRUD References Class
 * @class Controler
 * @extends {Postgres}
 */
class References {
  /**
   * Create a new reference
   * @param {Object} reference - Name of the reference
   * @param {string} reference.reference_name - Name of the reference
   * @param {string} reference.reference_country_name - Name of the reference
   * @param {string} reference.reference_date - Name of the reference
   * @param {string} reference.reference_content - Name of the reference
   * @param {string} reference.reference_category_id - Name of the reference
   */
  async addOne (request, response, next) {
    const token = request.headers["x-access-token"];
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return next(new ErrorReferenceCredential("Problème d'identifiant", 400))
    }
  
    const data = jwt.decode(request.headers["x-access-token"]);
    const { reference } = request.body;

    await Postgres.query(`
      INSERT
      INTO "references"
        (reference_name, reference_country_name, reference_date, reference_content, reference_category_id)
      VALUES ($1, $2, $3, $4,  $6)
    `, [

        reference.reference_name,
        reference.reference_country_name,
        reference.reference_date,
        reference.reference_content,
        reference.reference_category_id,
    ]);

    response.status(202).json({
      reference: {
        name: reference.reference_name,
        country: reference.reference_country_name,
        date: reference.reference_date,
        content: reference.reference_content,
        category: reference.reference_category_id,
      }
    });
  }  
  /**
   * Delete a reference by id
   * @param Number id - Id of the reference to delete
   */
  async deleteOne () {
    catchAsyncErrors(async (request, result, next) => {
      const { id } = request.params
  
      const results = await Postgres.query(
        'DELETE FROM "references" WHERE "id" = $1',
        [id]
      );

      res.status(200).json({
        message:"references has been deleted..."
      });
    });
  }
  /**
   * Get all references
   * @route GET /api/v1/references
   */
  async getAll (_, response, next) {
    const referencesRequest = `  
      SELECT
        "references".id AS id, "references".reference_name AS name,
        categories.category_name AS category,
        array_agg(themes.theme_label)  AS themes,
        "references".reference_country_name AS country,
        "references".reference_date AS date
      FROM "references"
      JOIN categories ON "references".reference_category_id = categories.id
      LEFT JOIN sections ON categories.section_id = sections.id
      LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
      LEFT JOIN themes ON themes.id = rt.reference_theme_id
      GROUP BY "references".id, categories.category_name;
    `
    const referencesResult = await Postgres.query(referencesRequest);

    if (!referencesResult) {
      return next(new ErrorReferenceNotFound())
    }

    response.status(200).json({ references: referencesResult.rows });
  }
  /**
   * Get reference by section ID
   * @route GET /api/v1/references/section/:section
   */
  async getAllBySection (request, response) {
    const { section } = request.params;
    const referencesRequest = `  
      SELECT
        "references".id AS id, "references".reference_name AS name,
        categories.category_name AS category,
        array_agg(themes.theme_label)  AS themes,
        "references".reference_country_name AS country,
        "references".reference_date AS date
      FROM "references"
      JOIN categories ON "references".reference_category_id = categories.id
      LEFT JOIN sections ON categories.section_id = sections.id
      LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
      LEFT JOIN themes ON themes.id = rt.reference_theme_id
      WHERE section_name = $1
      GROUP BY "references".id, categories.category_name;
    `
    const referencesResult = await Postgres.query(referencesRequest, [section]);

    if (!referencesReq) {
      return next(new ErrorReferenceNotFound())
    }

    result.status(200).json({ references: referencesResult.rows });
  }
  /**
   * Get references by theme ID
   */
  async getAllByTheme (req, res) {
    const themeName = req.params.theme;
    const referencesReq = await Postgres.query(`
      SELECT
        "references".id as id, "references".reference_name as name,
        categories.category_name as category,
        array_agg(themes.theme_label) as themes
      FROM "references"
      JOIN categories ON "references".reference_category_id = categories.id
      LEFT JOIN sections ON categories.section_id = sections.id
      LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
      LEFT JOIN themes ON themes.id = rt.reference_theme_id
      WHERE "theme_name" = $1
      GROUP BY "references".id, categories.category_name;
    `, [themeName]);

    if (!referencesReq) {
      return next(new ErrorReferenceNotFound("This reference cannot be found", 401))
    }

    res.status(200).json({
      references: referencesReq.rows,
    });
  }
  /**
   * Get reference by id
   * @route GET /api/v1/references/:id
   */
  async getOne (request, response) {
    const categoryId = request.params.id;
    const reference = await Postgres.query(`
      SELECT
        "references".id AS id, "references".reference_name AS name,
        categories.category_name AS category,
        array_agg(themes.theme_label)  AS themes,
        "references".reference_country_name AS country,
        "references".reference_date AS date,
        "references".reference_author AS author,
        "references".reference_content AS content
      FROM "references"
      JOIN categories ON "references".reference_category_id = categories.id
      LEFT JOIN sections ON categories.section_id = sections.id
      LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
      LEFT JOIN themes ON themes.id = rt.reference_theme_id
      WHERE "references".id = $1
      GROUP BY "references".id, categories.category_name;
    `, [categoryId]);
    
    if (!reference) {
      return next(new ErrorReferenceNotFound("The theme cannot be found", 401))
    }

    response.status(200).json({ reference: reference.rows });
  }
  /**
   * Update a reference by id
   */
  async updateOne () {
    catchAsyncErrors(async (_req, res, next) => {
      res.status(200).json({
          message: "reference has been updated",
      });
    });
  }
}

module.exports = new References();
