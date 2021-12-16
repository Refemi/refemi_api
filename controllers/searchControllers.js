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
      return res.status(404).json([]);
    }
    res.status(200).json(result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getAllSearch };
