import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;
let country=[];

const db= new pg.Client({
  user:"postgres",
  database:"world",
  password:"Vijay",
  host:"localhost",
  port:5432
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
db.connect();
app.get("/", async (req, res) => {
  try{
    
  const response= await db.query("select country_code from visited_countries");

  if (response.rows.length!==0){
  const result=response.rows;
  result.forEach((rec)=>{country.push(rec.country_code)});
  console.log(country);
  };
  res.render("index.ejs",{countries:country,total:country.length});
  }
  catch(err)
  {
    console.log(err);
    res.redirect("/");
  }
  //Write your code here.
});

// const result = await db.query(
//   "SELECT country_code FROM countries WHERE country_name = $1",
//   [input]
// );
app.post("/add",async(req,res)=>{
  try{
   let userData=req.body.country;
   let response=await db.query("select country_code from countries where upper(country_name)=upper($1)",[userData]);
  //  console.log(response);
   let result= response.rows;
   country.push(result[0].country_code);
  //  console.log(result[0].country_code);
  //  console.log(country);
   await db.query("Insert into visited_countries (country_code) values ($1)",[result[0].country_code]);
   let total=await db.query("SELECT count(id) FROM public.visited_countries;");
  let num=total.rows;
  console.log(num);
   res.render("index.ejs",{countries:country,total:num[0].count});
   console.log(num[0].count);
  }catch(err)
  {
    console.log(err.message);

    res.render("index.ejs",{error:"re enter",countries:country,total:7});
  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
