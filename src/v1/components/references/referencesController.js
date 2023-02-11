const { Pool } = require("pg");
const Postgres = new Pool();

const {
  ErrorReferenceNotFound,
  ErrorReferenceAlreadyExist,
  ErrorReferencesThemesLimit,
} = require("./referencesErrors");

class References {
  async addOneReference(request, response, next) {
    try {
      const reference = request.body;
      const referenceThemesIds = reference.reference_theme_id;

      // Verify if reference already exists before creating it
      const referenceQuery = `SELECT * FROM "references" WHERE "reference_name" = $1`;
      const referenceNameArgument = [reference.reference_name];
      const referenceNameResult = await Postgres.query(
        referenceQuery,
        referenceNameArgument
      );
      if (referenceNameResult.rows.length > 0) {
        throw new ErrorReferenceAlreadyExist();
      }

      const referenceRequest = `
        INSERT
        INTO "references"
          (reference_contributor_id, reference_name, reference_country_name, reference_date, reference_content,reference_category_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING reference_name, reference_country_name, reference_date, reference_content, reference_category_id, id as reference_theme_reference_id
      `;

      const referenceArgument = [
        request.userId,
        reference.reference_name,
        reference.reference_country_name,
        reference.reference_date,
        reference.reference_content,
        reference.reference_category_id,
      ];

      // limit the number of themes between 1 and 5
      if (referenceThemesIds.length === 0 || referenceThemesIds.length > 5) {
        throw new ErrorReferencesThemesLimit();
      }

      const insertReference = await Postgres.query(
        referenceRequest,
        referenceArgument
      );

      for (let i in referenceThemesIds) {
        await Postgres.query(
          `
          INSERT INTO "reference_themes" (reference_theme_reference_id, reference_theme_id)
          VALUES ($1, $2)
        `,
          [
            insertReference.rows[0].reference_theme_reference_id,
            referenceThemesIds[i],
          ]
        );
      }

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
      if (error.code === "23505") {
        next(new ErrorReferenceAlreadyExist());
      } else {
        next(error);
      }
    }
  }

  /**
   * Delete a reference by id
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
   */
  async getAllReferences(_, response, next) {
    try {
      const referencesRequest = `  
        SELECT
        "references".id AS id, "references".title AS name,
        section_id,
        categories.id, 
        array_agg(DISTINCT authors.author_name) AS author,
        array_agg(DISTINCT themes.theme_name) AS themes,
        "references".is_active,
        array_agg(DISTINCT countries.country_name) AS country,
        creation_date AS created_at,
        validation_date AS validated_at
      FROM "references"
      JOIN categories ON category_id = categories.id
      LEFT JOIN sections ON categories.section_id = sections.id
      LEFT JOIN references_themes rt  ON "references".id = rt.reference_id
      LEFT JOIN themes ON themes.id = rt.theme_id
      LEFT JOIN references_authors ra ON "references".id = ra.reference_id
      LEFT JOIN authors ON authors.id = ra.author_id
      LEFT JOIN references_countries rc ON "references".id = rc.reference_id
      LEFT JOIN countries ON countries.id = rc.country_id
      GROUP BY "references".id, section_id, categories.id;
      `;

      const referencesResult = await Postgres.query(referencesRequest);

      if (!referencesResult) {
        throw new ErrorReferenceNotFound();
      }

      const references = referencesResult.rows.reduce(
        (references, reference) => {
          if (reference.status) {
            references.validated.push(reference);
          } else {
            references.pending.push(reference);
          }
          return references;
        },
        { validated: [], pending: [] }
      );

      response.status(200).json({ references });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get reference by section id
   */
  async getAllReferencesBySection(request, response, next) {
    try {
      const { id } = request.params;
      const referencesRequest = `
      SELECT
      "references".id AS id, "references".title AS name,
      categories.category_name AS category,
      array_agg(DISTINCT authors.author_name) AS author,
      array_agg(themes.theme_name) AS themes,
      array_agg(DISTINCT countries.country_name) AS country,
      "references".reference_date AS date
    FROM "references"
    JOIN categories ON "references".category_id = categories.id
    LEFT JOIN sections ON "categories".section_id = sections.id
    LEFT JOIN references_themes rt  ON "references".id = reference_id
    LEFT JOIN themes ON themes.id = rt.theme_id
    LEFT JOIN references_authors ra ON "references".id = ra.reference_id
    LEFT JOIN authors ON authors.id = ra.author_id
    LEFT JOIN references_countries rc ON "references".id = rc.reference_id
    LEFT JOIN countries ON countries.id = rc.country_id
    WHERE "categories".section_id = $1
    GROUP BY "references".id, categories.category_name;
      `;

      const referencesResult = await Postgres.query(referencesRequest, [id]);

      if (!referencesResult || referencesResult.rowCount === 0) {
        throw new ErrorReferenceNotFound();
      }

      referencesResult.rows.author;
      response.status(200).json({ references: referencesResult.rows });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get references by theme id
   */
  async getAllReferencesByTheme(request, response, next) {
    try {
      const { id } = request.params;
      const referencesRequest = `
      SELECT "references".id AS id, "references".title AS name,
      section_id,
      categories.category_label AS category_label, 
      categories.category_name AS category_name, 
      array_agg(DISTINCT authors.author_name) AS author,
      array_agg(DISTINCT themes.theme_name) AS themes,
      "references".is_active,
      array_agg(DISTINCT countries.country_name) AS country
      FROM "references"
    JOIN categories ON category_id = categories.id
    LEFT JOIN sections ON categories.section_id = sections.id
    LEFT JOIN references_themes rt  ON "references".id = rt.reference_id
    LEFT JOIN themes ON themes.id = rt.theme_id
    LEFT JOIN references_authors ra ON "references".id = ra.reference_id
    LEFT JOIN authors ON authors.id = ra.author_id
    LEFT JOIN references_countries rc ON "references".id = rc.reference_id
    LEFT JOIN countries ON countries.id = rc.country_id
    WHERE $1 =ANY("references".themes_id)
      GROUP BY "references".id, categories.category_name, categories.section_id, categories.id
      `;

      const referencesResult = await Postgres.query(referencesRequest, [id]);
      if (!referencesResult || referencesResult.rowCount === 0) {
        throw new ErrorReferenceNotFound();
      }

      response.status(200).json({ references: referencesResult.rows });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get references by user id
   */
  async getAllReferencesByUser(request, response, next) {
    try {
      // userid is obtained from the token
      const { userId } = request;
      console.log(userId);
      const referencesRequest = `
      SELECT
      "references".id as id, "references".title as name,
      section_id AS "section_id",
      categories.id as category_id,
      array_agg(t.theme_label) as themes,
      "references".is_active as validated
    FROM "references"
    JOIN categories ON "references".category_id = categories.id
    LEFT JOIN sections ON categories.section_id = sections.id
    LEFT JOIN references_themes rt  ON "references".id = rt.reference_id
    LEFT JOIN themes t ON t.id = rt.theme_id
    WHERE "references".contributor_id = $1
    GROUP BY "references".id, category_name, categories.id, categories.section_id
      `;

      const referencesResult = await Postgres.query(referencesRequest, [
        userId,
      ]);

      if (!referencesResult) {
        throw new ErrorReferenceNotFound();
      }
      const references = referencesResult.rows.reduce(
        (references, reference) => {
          if (reference.validated) {
            references.validated.push(reference);
          } else {
            references.pending.push(reference);
          }
          return references;
        },
        { validated: [], pending: [] }
      );

      response.status(200).json({ references });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get reference by id
   */
  async getOneReference(request, response, next) {
    try {
      const { id } = request.params;
      const referenceRequest = `
        SELECT
          "references".id AS id, "references".reference_name AS name,
          categories.category_name AS category,
          "references".reference_category_id  AS categoryId,
          array_agg(themes.theme_label) AS themes,
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

      if (!referenceResult || referenceResult.rowCount === 0) {
        throw new ErrorReferenceNotFound("The theme cannot be found", 401);
      }

      response.status(200).json({ reference: referenceResult.rows });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a reference by id
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
