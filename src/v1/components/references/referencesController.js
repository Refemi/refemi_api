const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const { ErrorReferenceNotFound,ErrorReferencesThemesLimit } = require("./referencesErrors");

/**
 * @description CRUD References Class
 */
class References {
  /**
   * Create a new reference
   * @param {string} reference.reference_name - Name of the reference
   * @param {string} reference.reference_country_name - Name of the reference
   * @param {string} reference.reference_date - Name of the reference
   * @param {string} reference.reference_content - Name of the reference
   * @param {string} reference.reference_category_id - Name of the reference
   * @param {Array} reference.reference_theme_id - id of the themes
   * @route POST /api/v1/references
   */
  async addOneReference(request, response, next) {
    try {
      const  reference  = request.body;
      const referenceThemesIds = reference.reference_theme_id
     
      
      const referenceRequest = `
        INSERT
        INTO "references"
          (reference_name, reference_country_name, reference_date, reference_content,reference_category_id)
        VALUES ($1, $2, $3, $4,$5,)
        RETURNING reference_name, reference_country_name, reference_date, reference_content, reference_category_id,id as reference_theme_reference_id
      `;

      const referenceArgument = [
        reference.reference_name,
        reference.reference_country_name,
        reference.reference_date,
        reference.reference_content,
        reference.reference_category_id,
      ];

      
      if(referenceThemesIds.length === 0 || referenceThemesIds.length > 5){
        throw new ErrorReferencesThemesLimit();
      }

      const insertReference = await Postgres.query(referenceRequest, referenceArgument);
     

       for( var i in referenceThemesIds ){

            await Postgres.query(
            ` INSERT INTO "reference_themes"
              (reference_theme_reference_id,reference_theme_id)
            VALUES ($1, $2)`,
            [
              insertReference.rows[0].reference_theme_reference_id,
              referenceThemesIds[i]
            ]
            );
          
          }
      
     
      // TODO: Return the reference with the elements created in base
      response.status(202).json({
        reference: {
          name: reference.reference_name,
          country: reference.reference_country_name,
          date: reference.reference_date,
          content: reference.reference_content,
          category: reference.reference_category_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Delete a reference by id
   * @param Number id - Id of the reference to delete
   * @route DELETE /api/v1/references/:id
   */
  async deleteOneReference(request, response, next) {
    try {
      const { id } = request.params;
      const referenceRequest = `
        DELETE FROM "references"
        WHERE "id" = $1
      `;

      const referenceResult = await Postgres.query(referenceRequest, [id]);
      if (referenceResult.rowCount === 0) {
        throw new ErrorReferenceNotFound();
      }

      response.status(200).json({
        message: "Reference has been deleted",
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get all references
   * @route GET /api/v1/references
   */
  async getAllReferences(_, response, next) {

    try {
      const referencesRequest = `  
        SELECT
          "references".id AS id, "references".reference_name AS name,
          section_id AS "section",
          categories.id AS category, 
          array_agg(themes.id) AS themes,
          reference_status AS status,
          reference_contributor_id AS contributor,
          reference_country_name AS country,
          reference_creation_date AS created_at,
          reference_validation_date AS validated_at
        FROM "references"
        JOIN categories ON reference_category_id = categories.id
        LEFT JOIN sections ON categories.section_id = sections.id
        LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
        LEFT JOIN themes ON themes.id = rt.reference_theme_id
        GROUP BY "references".id, section_id, categories.id;
      `;

      const referencesResult = await Postgres.query(referencesRequest);

      if (!referencesResult) {
        throw new ErrorReferenceNotFound();
      }

      const references = referencesResult.rows.reduce((references, reference) => {
        if (reference.status) {
          references.validated.push(reference)
        } else {
          references.pending.push(reference)
        }
        return references;
      }, { validated: [], pending: [] });

      response.status(200).json({ references });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get reference by section id
   * @route GET /api/v1/references/section/:id
   */
  async getAllReferencesBySection(request, response, next) {
    try {
      const { id } = request.params;
      const referencesRequest = `
        SELECT
          "references".id AS id, "references".reference_name AS name,
          categories.category_name AS category,
          array_agg(themes.theme_label)  AS themes,
          "references".reference_country_name AS country,
          "references".reference_date AS date
        FROM "references"
        JOIN categories ON "references".reference_category_id = categories.id
        LEFT JOIN sections ON "categories".section_id = sections.id
        LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
        LEFT JOIN themes ON themes.id = rt.reference_theme_id
        WHERE "categories".section_id = $1
        GROUP BY "references".id, categories.category_name;
      `;

      const referencesResult = await Postgres.query(referencesRequest, [id]);

      if (!referencesResult) {
        throw new ErrorReferenceNotFound();
      }

      response.status(200).json({ references: referencesResult.rows });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get references by theme id
   * @route GET /api/v1/references/theme/:id
   */
  async getAllReferencesByTheme(request, response, next) {
    try {
      const { id } = request.params;
      const referencesRequest = `
        SELECT
          "references".id as id, "references".reference_name as name,
          categories.category_name as category,
          array_agg(t.theme_label) as themes
        FROM "references"
        JOIN categories ON "references".reference_category_id = categories.id
        LEFT JOIN sections ON categories.section_id = sections.id
        LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
        LEFT JOIN themes t ON t.id = rt.reference_theme_id
        WHERE t.id = $1
        GROUP BY "references".id, categories.category_name
      `;

      const referencesResult = await Postgres.query(referencesRequest, [id]);

      if (!referencesResult) {
        throw new ErrorReferenceNotFound();
      }

      response.status(200).json({ references: referencesResult.rows });
    } catch (error) {
      next(error);
    }
  }
  /**
 * Get references by theme id
 * @route GET /api/v1/references/user/
 */
  async getAllReferencesByUser(request, response, next) {
    try {
      const { userId } = request;

      const referencesRequest = `
        SELECT
          "references".id as id, "references".reference_name as name,
          categories.category_name as category,
          categories.id as category_id,
          array_agg(t.theme_label) as themes
        FROM "references"
        JOIN categories ON "references".reference_category_id = categories.id
        LEFT JOIN sections ON categories.section_id = sections.id
        LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
        LEFT JOIN themes t ON t.id = rt.reference_theme_id
        WHERE "references".reference_contributor_id = $1
        GROUP BY "references".id, category_name, category_id
      `;

      const referencesResult = await Postgres.query(referencesRequest, [userId]);
      if (!referencesResult) {
        throw new ErrorReferenceNotFound();
      }

      const references = referencesResult.rows.reduce((references, reference) => {
        if (reference.status) {
          references.validated.push(reference)
        } else {
          references.pending.push(reference)
        }
        return references;
      }, { validated: [], pending: [] });

      response.status(200).json({ references });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get reference by id
   * @route GET /api/v1/references/:id
   */
  async getOneReference(request, response, next) {
    try {
      const { id } = request.params;
      const referenceRequest = `
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
      `;
      const referenceResult = await Postgres.query(referenceRequest, [id]);

      if (!referenceResult) {
        throw new ErrorReferenceNotFound("The theme cannot be found", 401);
      }

      response.status(200).json({ reference: referenceResult.rows });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Update a reference by id
   * @route PUT /api/v1/references/:id
   */
  async updateOneReference(_request, response, next) {
    try {
      response.status(200).json({
        message: "reference has been updated",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new References();
