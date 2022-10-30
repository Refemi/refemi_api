const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Errors Handler
const { ErrorReferencesNotFound } = require("./counterErrors");

class Counters {
  /**
   * Get Home page Counters by number of total references, number of contributions and monthly references number
   */
  async getHomeCounters(_, response, next) {
    try {
      // Counter for all validated references
      const totalReferenceByContributors = await Postgres.query(`
        SELECT COUNT("references".id) AS references_count, COUNT(DISTINCT u.id) as contributors_count
        FROM "references"
        INNER JOIN "users" u on u.id = "references".reference_contributor_id
        WHERE "references".reference_status = true;
      `);

      // Counter for all validated references of the month
      const date = new Date();
      let month = date.getMonth() + 1;

      if (month < 10) {
        month = "0" + month.toString();
      }

      const monthRefs = await Postgres.query(
        'SELECT COUNT(*) FROM "references" WHERE EXTRACT(MONTH FROM "reference_creation_date") = $1 AND "references".reference_status = true',
        [month]
      );

      // Parse the SQL result to a int for client-side processing
      response.status(200).json({
        totalReferences: parseInt(
          totalReferenceByContributors.rows[0].references_count
        ),
        totalContributors: parseInt(
          totalReferenceByContributors.rows[0].contributors_count
        ),
        monthReferences: parseInt(monthRefs.rows[0].count),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Dashboard counters by user number contribution validate or waiting
   */
  async getDashboardUserCounters(request, response, next) {
    try {
      // userid is obtained from the token
      const { userId } = request;

      // Number of validated contributions by user (contributor)
      const totalContributionsRequest = `
        SELECT
          (SELECT COUNT(*) FROM "references" WHERE "references".reference_status = TRUE AND "reference_contributor_id" = $1) AS total_approved_contributions,
          (SELECT COUNT(*) FROM "references" WHERE "references".reference_status = FALSE AND "reference_contributor_id" = $1) AS total_pending_contributions
      `;
      const totalContributionsResult = await Postgres.query(
        totalContributionsRequest,
        [userId]
      );
      if (!totalContributionsResult) {
        throw new ErrorReferencesNotFound();
      }

      // Parse the SQL result to a int for client-side processing
      response.status(200).json({
        counters: {
          totalApprovedContributions: parseInt(
            totalContributionsResult.rows[0].total_approved_contributions
          ),
          totalPendingContributions: parseInt(
            totalContributionsResult.rows[0].total_pending_contributions
          ),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Admin Dashboard Counters
   */
  async getDashboardAdminCounters(_, response, next) {
    try {
      // Total approved contributions
      const totalContributionsRequest = `
        SELECT
          (SELECT COUNT(*) FROM "references" WHERE "references".reference_status = TRUE) AS total_approved_contributions,
          (SELECT COUNT(*) FROM "references" WHERE "references".reference_status = FALSE) AS total_pending_contributions,
          (SELECT COUNT(DISTINCT "reference_contributor_id") FROM "references" WHERE "reference_status" = TRUE) AS total_contributors,
          (SELECT COUNT(*) FROM "users" WHERE "user_role" = 3) AS total_administrators
      `;
      const totalContributionsResult = await Postgres.query(
        totalContributionsRequest
      );

      // Parse the SQL result to a int for client-side processing
      response.status(200).json({
        counters: {
          totalApprovedContributions: parseInt(
            totalContributionsResult.rows[0].total_approved_contributions
          ),
          totalPendingContributions: parseInt(
            totalContributionsResult.rows[0].total_pending_contributions
          ),
          totalContributors: parseInt(
            totalContributionsResult.rows[0].total_contributors
          ),
          totalAdministrators: parseInt(
            totalContributionsResult.rows[0].total_administrators
          ),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Counters();
