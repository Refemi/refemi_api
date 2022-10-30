const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

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
      SELECT DISTINCT categories.category_name AS category, "references".id , "reference_name" as name, "reference_country_name" as country, "reference_category_id", "reference_author" as author, (SELECT array_agg(t.theme_label) as themes
      FROM "references" AS sousReference
        JOIN categories sousCategories ON sousReference.reference_category_id = sousCategories.id
        LEFT JOIN sections sourSection ON sousCategories.section_id = sourSection.id
        LEFT JOIN reference_themes sRt  ON "references".id = sRt.reference_theme_reference_id
        LEFT JOIN themes t ON t.id = sRt.reference_theme_id
      WHERE sousReference.id = "references".id)
          FROM "references"
          JOIN categories ON "references".reference_category_id = categories.id
        LEFT JOIN sections ON categories.section_id = sections.id
        LEFT JOIN reference_themes rt  ON "references".id = rt.reference_theme_reference_id
        LEFT JOIN themes ON themes.id = rt.reference_theme_id
          WHERE to_tsvector (
            "reference_name" || ' ' ||"reference_country_name" || ' ' ||"reference_content" || ' ' || "reference_country_name" || ' ' ||"reference_category_id")
            @@ to_tsquery ($1);
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
   * Get reference_name to suggest the titel in input rafernce name
   * @route GET /api/v1/search/reference-name
   */
  async getAllSearchReferencesByName(request, response, next) {
    try {
      const referencesRequest = `
          SELECT "id", "reference_name"
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

// const { Pool } = require("pg");
// const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// const getAllSearch = async (req, res) => {
//   const search = req.query.answer;

//   try {
//     const result = await Postgres.query(
//       `select "id", "reference_name","reference_content","reference_country_name", "reference_category_id" from "references" where to_tsvector ( "reference_name" || ' ' ||"reference_country_name" || ' ' ||"reference_content" || ' ' || "reference_country_name" || ' ' ||"reference_category_id") @@ to_tsquery ($1)`,
//       [search]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({
//         message: "this search result does not exist in the database",
//       }
//       );
//     }
//     res.status(200).json({
//       search : result.rows});

//   }catch (error) {
//     res.status(500).json({
//       message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
//       error:error
//     });}
// };

// module.exports = { getAllSearch };
