const { Pool } = require("pg");
const Postgres = new Pool({ ssl: { rejectUnauthorized: false } });
const jwt = require("jsonwebtoken");

// Errors Route
const ErrorHander = require("../../../utils/errorhander");
const catchAsyncErrors = require("../../../middlewares/catchAsyncErrors");

// get all references

const getReferences = catchAsyncErrors(async (req, res,next) => {
  const categoryName = req.params.category;

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

    if(!referencesReq){
         return next(new ErrorHander("There are no references  that exist", 404))
    }

    res.status(200).json({
      references: referencesReq.rows,
    });
});

// get reference by Id
const getReferenceById = catchAsyncErrors(async (req, res , next) => {
  const categoryId = req.params.id;

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
         if(!reference){
         return next(new ErrorHander("The theme cannot be found", 401))
    }

    res.status(200).json({
      reference: reference.rows,
    });
  
});

//get Reference By Theme

const getReferenceByTheme = catchAsyncErrors(async (req, res, next) => {
  const themeName = req.params.theme;

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

     if(!referencesReq){
         return next(new ErrorHander("This reference cannot be found", 401))
    }

    res.status(200).json({
      references: referencesReq.rows,
    });
 
});

// add references
const postReferences = catchAsyncErrors(async (req, res,next) => {
  const token = req.headers["x-access-token"];
  console.log(token)
    
        const verifyToken =  jwt.verify(token, process.env.JWT_SECRET);
        if(!verifyToken){
          return next(new ErrorHander("Problème d'identifiant", 400))
        }
  
  const data = jwt.decode(req.headers["x-access-token"]);
  const newReferenceBody = req.body;

   console.log(newReferenceBody.reference_theme_id.length)
   if(newReferenceBody.reference_theme_id.length === 0 ||  newReferenceBody.reference_theme_id.length > 6){
        return next(new ErrorHander("themes can be added a minimum of 1 to a maximum of 6!", 401))
   }

    const  InsertReference= await Postgres.query(`
      INSERT
      INTO "references"
        (reference_name, reference_country_name, reference_date, reference_content, reference_contributor_id, reference_category_id)
      VALUES ($1, $2, $3, $4,$5,$6)
      RETURNING reference_name, reference_country_name, reference_date, reference_content, reference_contributor_id, reference_category_id,id as reference_theme_reference_id
    `, [

        newReferenceBody.reference_name,
        newReferenceBody.reference_country_name,
        newReferenceBody.reference_date,
        newReferenceBody.reference_content,
        data.id,
        newReferenceBody.reference_category_id,
    ]);
    console.log("ref",InsertReference.rows[0].reference_theme_reference_id)
    for(i in newReferenceBody.reference_theme_id){

       await Postgres.query(
       ` INSERT INTO "reference_themes"
         (reference_theme_reference_id,reference_theme_id)
       VALUES ($1, $2)`,
       [
         InsertReference.rows[0].reference_theme_reference_id,
         newReferenceBody.reference_theme_id[i]
       ]
       );
    }
      
       
    res.status(202).json({
      message: "Reference added!",
    });
  
});

// update references

const putReferences = catchAsyncErrors(async (_req, res,next) => {
    res.status(200).json({
        message: " refrtences  has been updated",
      });
});

//delete references

const deleteReferences = catchAsyncErrors(async (req, res,next) => {
  const id = req.params.id;
  
    const results = await Postgres.query(
      'DELETE FROM "references" WHERE "id" = $1',
      [id]
    );

    res.status(200).json({
      message:"references has been deleted..."
    });
 
});

module.exports = {
  getReferences,
  getReferenceById,
  getReferenceByTheme,
  postReferences,
  putReferences,
  deleteReferences,
};






