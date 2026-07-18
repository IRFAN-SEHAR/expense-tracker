import express from "express"
import dotenv from "dotenv"
import bodyParser, { urlencoded } from "body-parser"
import bcrypt, {hash,hashSync} from "bcrypt"
import cors from "cors"
import pg from "pg"
dotenv.config()
const app = express();
const port = 3000;
const saltRounds = 10;
const db=new pg.Client({
user:process.env.DB_USER,
host:process.env.DB_HOST,
database:process.env.DB_DATABASE,
password:process.env.DB_PASSWORD,
port:5432
})
db.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({origin: "*" }))
app.use(express.static("public"));
app.post("/users", async(req, res)=>{
  const email= req.body.username;
  const planeTextPassword = req.body.password;
  try {
    const checkResult = await db.query(`SELECT * FROM users WHERE email=$1`,[email]);
    if (checkResult.rows.length>0) {
      res.json("email already exits please login!");
    } else {
     await bcrypt.hash(planeTextPassword , saltRounds , (err , hash)=>{
         db.query(`INSERT INTO users (email , password_hash) VALUES($1 , $2)`,[email , hash]);
       
      });
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500).send("error entering data!");
  }
})
app.post("/users", async(req,res)=>{
  const email = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query(`SELECT * FROM users WHERE email=$1`,[email])
    if (result.rows.length>0) {
       const savedHashedPassword = result.rows[0].password
       bcrypt.compare(password , savedHashedPassword,(err , result)=>{
        if (err) {
          console.log("error compairing password" , err)
        } else {
          if (result) {
            res.redirect("/")
          } else {
            console.log("password is incorrect!");
          }
          
        }
       })
  
    } else {
      res.send("user not found")
      alert("User not found!")
    }
   
  } catch (error) {
    
  }
})
app.get("/data", async(req,res)=>{
    const month = req.query.month;
    const year = req.query.year;
   
    // console.log(month)
   try {
  let expenses;
  let total;

  
  if (month > 0 && year) {
    expenses = await db.query(
      `SELECT * FROM data
       WHERE EXTRACT(MONTH FROM expense_date)::int = $1
       AND EXTRACT(YEAR FROM expense_date)::int = $2`,
      [month, year]
    );
     total = await db.query(
    `SELECT SUM(amount) AS total_expense
     FROM data
     WHERE EXTRACT(MONTH FROM expense_date)::int = $1
       AND EXTRACT(YEAR FROM expense_date)::int = $2`,
    [month, year]
);



  
  } else if (month > 0) {
    expenses = await db.query(
      `SELECT * FROM data
       WHERE EXTRACT(MONTH FROM expense_date)::int = $1`,
      [month]
    );
        total = await db.query(
    `SELECT SUM(amount) AS total_expense
     FROM data
     WHERE EXTRACT(MONTH FROM expense_date)::int = $1`,
    [month]
);

  
  } else if (month === 0 && year) {
    expenses = await db.query(
      `SELECT * FROM data
       WHERE EXTRACT(YEAR FROM expense_date)::int = $1`,
      [year]
    );
    total = await db.query(
    `SELECT SUM(amount) AS total_expense
     FROM data
     WHERE EXTRACT(YEAR FROM expense_date)::int = $2`,
    [year]
);
  
  } else if (year) {
    expenses = await db.query(
      `SELECT * FROM data
       WHERE EXTRACT(YEAR FROM expense_date)::int = $1`,
      [year]
    );

  
  } else {
    expenses = await db.query(`SELECT * FROM data`);
        total = await db.query(
    `SELECT SUM(amount) AS total_expense
     FROM data`);
   
  }

  // console.log(result.rows);
  // res.json(result.rows);
  res.json({
    expenses:expenses.rows,
    total:total.rows[0].total_expense
   
   });
//  console.log(total)

} catch (error) {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
}
});
// app.get("/data", async(req,res)=>{
//  response = await db.query(`SELECT SUM(amount) AS total_expense FROM data`)
//     console.log(response);
// })
app.post("/data" , async(req ,res)=>{
    const {title , category , amount , expense_date} = req.body
    // console.log(req.body)
    try {
       const result = await db.query("INSERT INTO data(title , category , amount , expense_date) VALUES($1 , $2 , $3 , $4) RETURNING *",
            [title , category , amount , expense_date]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error)
        res.sendStatus(500).send("Erorr adding data to db!!");
    }
});
app.put("/data/:id" , async(req,res)=>{
try {
    const {title , category , amount , expense_date} =req.body
    const id = req.params.id;
    await db.query("UPDATE data SET title = $1 , category = $2 , amount = $3 , expense_date = $4 WHERE id=$5",
        [title , category , amount , expense_date , id]
       
    );
     res.json({message:"Updated successfully!"})
} catch (error) {
    res.sendStatus(500).json({message:"Error updating data!"})
}
});
app.delete("/data/:id" , async(req, res)=>{
    try {
         const id = req.params.id
    await db.query("DELETE FROM data WHERE id=$1",[id]);
    res.json({message:"Deleted successfully!"});
    } catch (error) {
        res.sendStatus(500).json({message:"Error deleting the data!"});
    }
   
});
app.listen(port ,"0.0.0.0" ,  ()=>{
    console.log(`this app is listeninig on ${port}!`);
});
