const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const getAllSearch = async (req, res) => {
  const search = req.query.answer;

  try {
    const result = await Postgres.query(
      `select "id", "reference_name","reference_content","reference_country_name", "reference_category_id" from "references" where to_tsvector ( "reference_name" || ' ' ||"reference_country_name" || ' ' ||"reference_content" || ' ' || "reference_country_name" || ' ' ||"reference_category_id") @@ to_tsquery ($1)`,
      [search]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "this search result does not exist in the database",
      }
      );
    }
    res.status(200).json({
      search : result.rows});

    
  }catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error:error
    });}
};

module.exports = { getAllSearch };
