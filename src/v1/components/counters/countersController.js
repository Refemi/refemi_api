const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Errors Handler
const { ErrorHandler, ErrorReferencesNotFound } = require('./counterErrors');


//
/**
 * @description Counters Class
 */
class Counters {
  /**
   * @description Get Home page Counters by number of total references, number of contributions and monthly references number
   * @route GET /api/v1/counters/home
   */
  async getHomeCounters (_, response, next) {
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
  
      response.status(200).json({
        totalReferences: totalReferenceByContributors.rows[0].references_count,
        totalContributors: totalReferenceByContributors.rows[0].contributors_count,
        monthReferences: monthRefs.rows[0].count,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @description Get Dashboard counters by user number contribution validate or waiting
   * @route GET /api/v1/counters/dashboard/user
   */
  //
  async getDashboardUserCounters (request, response, next) {
    try {
      const { userId } = request;

      // Number of validated contributions by user (contributor)
      const totalApprovedContributionsRequest =`
        SELECT COUNT(*) 
        FROM "users"
        INNER JOIN "references" ON "users".id = "references".reference_contributor_id
        WHERE "users".id=$1 AND "references".reference_status=true;
      `;
      const totalApprovedContributionsResult = await Postgres.query(totalApprovedContributionsRequest, [userId]);

      if (!totalApprovedContributionsResult) {
        throw new ErrorReferencesNotFound()
      }
  
      // Number of pending contributions by user (contributor)
      const totalPendingContributionsRequest =`
        SELECT COUNT(*)
        FROM "references"
        INNER JOIN "users" ON "users".id = "references".reference_contributor_id
        WHERE "users".id=$1 AND "references".reference_status=false;
      `;
      const totalPendingContributionsResult = await Postgres.query(totalPendingContributionsRequest, [request.userId]);

      if (!totalPendingContributionsResult) {
        throw new ErrorReferencesNotFound()
      }

      response.status(200).json({
        counters: {
          totalApprovedContributions: parseInt(totalApprovedContributionsResult.rows[0].count),
          totalPendingContributions: parseInt(totalPendingContributionsResult.rows[0].count)
        }
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * @description Get Admin Dashboard Counters
   * @route GET /api/v1/counters/dashboard/admin
   */
  //
  async getDashboardAdminCounters (_, response, next) {
    try {
      // Total approved contributions
      const totalApprovedContributionsRequest = `
        SELECT COUNT(*)
        FROM "references"
        INNER JOIN "users" ON "users".id = "references".reference_moderator_id
        WHERE "references".reference_status = true;
      `;
      const totalApprovedContributionsResult = await Postgres.query(totalApprovedContributionsRequest);
      // Total pending contributions
      const totalPendingContributionsRequest = `
        SELECT COUNT(*)
        FROM "references"
        WHERE "references".reference_status = false;
      `;
      const totalPendingContributionsResult = await Postgres.query(totalPendingContributionsRequest);
      // Total contributors
      const totalContributorsRequest = `
        SELECT COUNT(DISTINCT "reference_contributor_id")
        FROM "references"
        WHERE "reference_status" = true
      ;`;
      const totalContributorsResult = await Postgres.query(totalContributorsRequest);
      // Total administrators
      const totalAdministratorsRequest = `
        SELECT COUNT(*)
        FROM "users"
        WHERE "user_role"=3
      `;
      const totalAdministratorsResult = await Postgres.query(totalAdministratorsRequest);

      response.status(200).json({
        counters: {
          totalApprovedContributions: parseInt(totalApprovedContributionsResult.rows[0].count),
          totalPendingContributions: parseInt(totalPendingContributionsResult.rows[0].count),
          totalContributors: parseInt(totalContributorsResult.rows[0].count),
          totalAdministrators: parseInt(totalAdministratorsResult.rows[0].count),
        }
      });
    } catch (error) {
      next(error);
    }
  };
}



module.exports = new Counters();
