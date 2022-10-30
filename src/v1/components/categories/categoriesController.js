// PostGreSQL dependencies
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Error Handlers
const { ErrorCategoriesNotFound } = require("./categoriesErrors");

class Categories {
  async getAllCategories(_, response, next) {
    try {
      const categoriesQuery = `
        SELECT categories.id, category_name AS name, category_label as label, section_id
          FROM categories
        INNER JOIN sections ON sections.id = section_id
      `;

      const categoriesResult = await Postgres.query(categoriesQuery);

      if (categoriesResult.rows.length === 0) {
        throw new ErrorCategoriesNotFound();
      }

      response.status(200).json({ categories: categoriesResult.rows });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all categories by section
   */
  async getAllCategoriesBySection(request, response, next) {
    try {
      let categories;
      const { section_id } = request.params;

      const categoriesQuery = `
        SELECT categories.id, category_name AS name, category_label as label
        FROM categories
        WHERE section_id = $1;
      `;
      const categoriesArgument = [section_id];

      const categoriesResult = await Postgres.query(
        categoriesQuery,
        categoriesArgument
      );

      if (categoriesResult.rows.length === 0) {
        throw new ErrorCategoriesNotFound(section_id);
      }

      categories = categoriesResult.rows;

      response.status(200).json({
        categories: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Categories();
