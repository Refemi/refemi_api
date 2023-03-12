const { Pool } = require("pg");
const Postgres = new Pool();

// Errors Route
const { ErrorSearchNoResult } = require("./searchErrors");

class Search {
  /**
   * Create a new reference
   * @param {Object} request.query.answer - Search
   * @route POST /api/v1/search
   */
  async getAllSearch(request, response, next) {
    try {
      const search = request.query.answer;

      const searchRequest = `
      SELECT DISTINCT categories.category_name AS category, "references".id , "references".title as name, array_agg(DISTINCT countries.country_name) AS country,
      "references".category_id, array_agg(DISTINCT authors.author_name) AS author, array_agg(DISTINCT themes.theme_label) as themes
      FROM "references"
        JOIN categories ON category_id = categories.id
        LEFT JOIN sections ON categories.section_id = sections.id
        LEFT JOIN references_themes rt  ON "references".id = rt.reference_id
        LEFT JOIN themes ON themes.id = rt.theme_id
        LEFT JOIN references_authors ra ON "references".id = ra.reference_id
        LEFT JOIN authors ON authors.id = ra.author_id
        LEFT JOIN references_countries rc ON "references".id = rc.reference_id
        LEFT JOIN countries ON countries.id = rc.country_id
          WHERE to_tsvector (
            "title" || ' ' ||"country_name" || ' ' || "author_name" || ' ' ||"category_id")
            @@ to_tsquery ('good')
            GROUP BY categories.category_name, "references".id;
      `;

      const searchResult = await Postgres.query(searchRequest, [search]);

      if (searchResult.rowCount === 0) {
        return next(new ErrorSearchNoResult());
      }

      response.status(200).json({
        search: searchResult.rows,
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * Get reference_name to suggest the title in reference name input
   */
  async getAllSearchReferencesByName(_, response, next) {
    try {
      const referencesRequest = `
          SELECT "id", "title"
          FROM "references"
        `;
      const referenceResult = await Postgres.query(referencesRequest);
      response.status(200).json({
        search: referenceResult.rows,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Search();
