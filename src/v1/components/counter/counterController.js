const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });

// Errors Route
const ErrorHander = require("../../../utils/errorhander");
const catchAsyncErrors = require("../../middlewares/catchAsyncErrors");

//get Home page Counters by number of total references, number of contributions and monthly references number

const getHomeCounters = catchAsyncErrors(async (_, res,) => {

    // Compteur nombre total de références
    const totalReferenceByContributors = await Postgres.query(`

      SELECT COUNT("references".id) AS references_count, COUNT(DISTINCT u.id) as contributors_count
      FROM "references"
      INNER JOIN "users" u on u.id = "references".reference_contributor_id
      WHERE "references".reference_status = true;
    `);

    // Compteur nombre de contributions du mois
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
      numberOfRefs: totalReferenceByContributors.rows[0].references_count,
      numberOfContributors: totalReferenceByContributors.rows[0].contributors_count,
      monthRefs: monthRefs.rows[0].count,
    });
   
});

//get Dashboard counters by user number contribution validate or waiting

const getDashboardUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers["x-access-token"];

    const verifyToken =  jwt.verify(token, process.env.JWT_SECRET);
  
  if(!verifyToken){
     return next(new ErrorHander("Problème d'identifiant", 400))
  }

  const data = jwt.decode(req.headers["x-access-token"]);

    // Nombre de  contributions par user (contributor)
    const totalContributions = await Postgres.query(
      'SELECT COUNT(*) FROM "users" INNER JOIN "references" ON "users".id = "references".reference_contributor_id WHERE "users".id=$1  AND "references".reference_status=true;',
      [data.id]
    );

    // Nombre de contributions en attente de validation (contributor)
    const pendingContributions = await Postgres.query(
      'SELECT COUNT(*) FROM "references" INNER JOIN "users" ON "users".id = "references".reference_contributor_id WHERE "users".id=$1 AND "references".reference_status=false;',
      [data.id]
    );

    res.status(200).json({
      approvedContributions: parseInt(totalContributions.rows[0].count),
      pendingContributions: parseInt(pendingContributions.rows[0].count),
    });
  } catch (error) {
    res.status(500).json({
      message: "The server encountered an unexpected condition which prevented it from fulfilling the request",
      error: error
    });
  
});
// get Admin Dashboard Counters
const getDashboardAdmin = catchAsyncErrors(async (req, res, next) => {
  
  const token = req.headers["x-access-token"];
  
    const verifyToken =  jwt.verify(token, process.env.JWT_SECRET);
  
  if(!verifyToken){
     return next(new ErrorHander("Problème d'identifiant", 400))
  }

  const data = jwt.decode(req.headers["x-access-token"]);
  
    const pendingContributions = await Postgres.query(`
        SELECT COUNT(*)
        FROM "references"
        WHERE "references".reference_status = false
        ;`);
    
    // Toutes les contributions approuvées
    const approvedContributions = await Postgres.query(`
      SELECT COUNT(*)
      FROM "references"
      INNER JOIN "users" ON "users".id = "references".reference_moderator_id
      WHERE "references".reference_status = true;
    ;`);


    // Nombre total de contributeurs (contributors)
    const totalContributors = await Postgres.query(`
      SELECT COUNT(DISTINCT "reference_contributor_id")
      FROM "references"
      WHERE "reference_status" = true
    ;`);
    // Nombre total d'administrateurs (administrators)
    const totalAdmins = await Postgres.query(
      'SELECT COUNT(*) FROM "users" WHERE "user_role"=3'
    );
      
    res.status(200).json({
      totalContributors: parseInt(totalContributors.rows[0].count),
      totalAdmins: parseInt(totalAdmins.rows[0].count),
    });
 
});

module.exports = {
  getHomeCounters,
  getDashboardUser,
  getDashboardAdmin,
};










