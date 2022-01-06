const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const getAllCategories = catchAsyncErrors(async (_, response, next) => {
  let categories;

    const categoriesQuery =
      "SELECT id, section_name AS name, section_label AS label FROM sections";
    const categoriesResult = await Postgres.query(categoriesQuery);

    if (categoriesResult.rows.length === 0) {
        return next(new ErrorHander("There are no registered categories", 404))
    }

    categories = categoriesResult.rows;

  await response.status(200).json({
    categories: categories,
  });
});

const getSubCategories = catchAsyncErrors(async (request, response,next) => {
  let subCategories;

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
        return next(new ErrorHander("There are no registered subcategories", 404))
    }

    subCategories = subCategoriesResult.rows;

  response.status(200).json({
    subCategories: subCategories,
  });
});

module.exports = {
  getAllCategories,
  getSubCategories,
};
