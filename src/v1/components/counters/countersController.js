const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Errors Handler
const { ErrorHandler } = require('./counterErrors');

//get Home page Counters by number of total references, number of contributions and monthly references number
class Counters {
  getHomeCounters = async (_, res, next) => {
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
  
      res.status(200).json({
        totalReferences: totalReferenceByContributors.rows[0].references_count,
        totalContributors: totalReferenceByContributors.rows[0].contributors_count,
        monthReferences: monthRefs.rows[0].count,
      });
    } catch (error) {
      next(error);
    }
  };
  //get Dashboard counters by user number contribution validate or waiting
  async getDashboardUser (req, res, next) {
    try {
      // Number of validated contributions by user (contributor)
      const totalContributions = await Postgres.query(
        'SELECT COUNT(*) FROM "users" INNER JOIN "references" ON "users".id = "references".reference_contributor_id WHERE "users".id=$1  AND "references".reference_status=true;',
        [data.id]
      );
  
      // Number of pending contributions by user (contributor)
      const pendingContributions = await Postgres.query(
        'SELECT COUNT(*) FROM "references" INNER JOIN "users" ON "users".id = "references".reference_contributor_id WHERE "users".id=$1 AND "references".reference_status=false;',
        [data.id]
      );
  
      res.status(200).json({
        approvedContributions: parseInt(totalContributions.rows[0].count),
        pendingContributions: parseInt(pendingContributions.rows[0].count),
      });
    } catch (error) {
      next(error);
    }
  };
  // get Admin Dashboard Counters
  async getDashboardAdmin (req, res, next) {
    const pendingContributions = await Postgres.query(`
          SELECT COUNT(*)
          FROM "references"
          WHERE "references".reference_status = false
          ;`);
  
    // Total approved contributions
    const approvedContributions = await Postgres.query(`
        SELECT COUNT(*)
        FROM "references"
        INNER JOIN "users" ON "users".id = "references".reference_moderator_id
        WHERE "references".reference_status = true;
      ;`);
  
    // Total contributors
    const totalContributors = await Postgres.query(`
        SELECT COUNT(DISTINCT "reference_contributor_id")
        FROM "references"
        WHERE "reference_status" = true
      ;`);
    // Total administrators
    const totalAdmins = await Postgres.query(
      'SELECT COUNT(*) FROM "users" WHERE "user_role"=3'
    );
  
    res.status(200).json({
      totalContributors: parseInt(totalContributors.rows[0].count),
      totalAdmins: parseInt(totalAdmins.rows[0].count),
      totalPendingContributions: parseInt(pendingContributions.rows[0].count),
      totalApprovedContributions: parseInt(approvedContributions.rows[0].count),
    });
  };
}



module.exports = new Counters();
