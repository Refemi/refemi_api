const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const jwt = require("jsonwebtoken");

const getReferences = async (req, res) => {
  const categoryName = req.params.category;

  try {
    const referencesReq = await Postgres.query(
      `
    
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

    `,
      [categoryName]
    );

    res.status(200).json({
      references: referencesReq.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error:error
    });
  }
};
const getReferenceById = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const reference = await Postgres.query(
      `
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

    `,
      [categoryId]
    );

    res.status(200).json({
      reference: reference.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error:error
    });}
};
const getReferenceByTheme = async (req, res) => {
  const themeName = req.params.theme;

  try {
    const referencesReq = await Postgres.query(
      `
    
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

    `,
      [themeName]
    );

    res.status(200).json({
      references: referencesReq.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error:error
    });
  }
};

const postReferences = async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {

    return res.status(400).json({
      message: "Problème d'identifiant",
    });
  }
  const data = jwt.decode(req.headers["x-access-token"]);
  try {

    const newReferenceBody = req.body;

    await Postgres.query(`
      INSERT
      INTO "references"
        (reference_name, reference_country_name, reference_date, reference_content, reference_contributor_id, reference_category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [

        newReferenceBody.reference_name,
        newReferenceBody.reference_country_name,
        newReferenceBody.reference_date,
        newReferenceBody.reference_content,
        data.id,
        newReferenceBody.reference_category_id,
    ]);

    res.status(202).json({
      message: "Reference added!",
    });
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error:error
    });
  }
};

const putReferences = async (_req, res) => {
  try {
    res.status(200).json({
        message: " refrtences  has been updated",
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteReferences = async (req, res) => {
  const id = req.params.id;

  try {
    const results = await Postgres.query(
      'DELETE FROM "references" WHERE "id" = $1',
      [id]
    );

    res.status(200).json({
      message:"references has been deleted..."
    }
      );
  }catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error:error
    });
  }
};

module.exports = {
  getReferences,
  getReferenceById,
  getReferenceByTheme,
  postReferences,
  putReferences,
  deleteReferences,
};
