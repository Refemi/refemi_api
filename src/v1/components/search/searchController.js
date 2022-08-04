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
  async getAllSearch (request, response, next) {
    try {
      const search = request.query.answer;

      const searchRequest = `
        SELECT "id", "reference_name", "reference_content", "reference_country_name", "reference_category_id"
        FROM "references"
        WHERE to_tsvector (
          "reference_name" || ' ' ||"reference_country_name" || ' ' ||"reference_content" || ' ' || "reference_country_name" || ' ' ||"reference_category_id")
          @@ to_tsquery ($1);
      `;

      const searchResult = await Postgres.query(searchRequest, [search]);

      if (searchResult.rowCount === 0) {
        return next(new ErrorSearchNoResult())
      }

      response.status(200).json({
        search : searchResult.rows
      });
    } catch (error) {
      next(error);
    }
  }
    /**
   * Get reference by id
   * @route GET /api/v1/search/:name
   */
    async getAllSearchReferencesByName (request, response, next) {  
      try {
        const referencesRequest = `
          SELECT "id", "reference_name"
          FROM "references"
          WHERE lower("reference_name") LIKE '%${request.params.name.toLowerCase()}%'
        `;
  
        const referenceResult = await Postgres.query(referencesRequest);
        response.status(200).json({
          search : referenceResult.rows
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