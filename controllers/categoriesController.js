const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

const getAllCategories = async (_, response) => {
  let categories;

  try {
    const categoriesQuery =
      "SELECT id, section_name AS name, section_label AS label FROM sections";
    const categoriesResult = await Postgres.query(categoriesQuery);

    if (categoriesResult.rows.length === 0) {
      return response.status(404).json({
        message: "There are no registered categories",
      });
    }

    categories = categoriesResult.rows;
  } catch (error) {
    response.status(500).json(error);
  }

  await response.status(200).json({
    categories: categories,
  });
};

const getSubCategories = async (request, response) => {
  let subCategories;

  try {
    const categoriesQuery = `
      SELECT categories.id AS id, category_name AS name, category_label as label
      FROM sections
      INNER JOIN  categories ON categories.section_id = sections.id
      WHERE sections.section_name = $1;`;
    const categoriesArgument = [request.params.category_name];

    const subCategoriesResult = await Postgres.query(
      categoriesQuery,
      categoriesArgument
    );

    if (subCategoriesResult.rows.length === 0) {
      return response.status(404).json({
        message: "There are no registered subcategories",
      });
    }

    subCategories = subCategoriesResult.rows;
  } catch (error) {
    return response.status(500).json(error);
  }

  response.status(200).json({
    subCategories: subCategories,
  });
};

module.exports = {
  getAllCategories,
  getSubCategories,
};
