import express from "express"
import dotenv from "dotenv"
import bodyParser, { urlencoded } from "body-parser"
import bcrypt, {hash,hashSync} from "bcrypt"
import passport from "passport"
import { Strategy } from "passport-local"
import session from "express-session";
import cors from "cors"
import pg from "pg"
dotenv.config()
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
const port = 3000;
const saltRounds = 10;
const db=new pg.Client({
user:process.env.DB_USER,
host:process.env.DB_HOST,
database:process.env.DB_DATABASE,
password:process.env.DB_PASSWORD,
port:5432
})
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:true,
   cookie: {
      secure: false, // true only when using HTTPS in production
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}))
app.use(passport.initialize());
app.use(passport.session());

db.connect();


app.use(cors({origin: "http://localhost:5173" , credentials: true, }))
app.use(express.static("public"));
app.post("/signup", async(req, res)=>{
  const email= req.body.username;
  const planeTextPassword = req.body.password;
  try {
    const checkResult = await db.query(`SELECT * FROM users WHERE email=$1`,[email]);
    if (checkResult.rows.length>0) {
      res.json("email already exits please login!");
      console.log("Email already exit please login!")
    } else {
     const HashedPassword= await bcrypt.hash(planeTextPassword , saltRounds)
        await db.query(`INSERT INTO users (email , password_hash) VALUES($1 , $2)`,[email , HashedPassword]);
       res.status(200).send("this is ok!!")
       console.log("this is ok!")
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(500).send("error entering data!");
    console.log("error entering data to the db!")
    
  }
})
// app.post("/login", async(req,res)=>{
//   const email = req.body.username;
//   const password = req.body.password;
//   })
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
       console.log("req.user after login:", req.user);
      res.json({
        success: true,
        user,
      });
    });
  })(req, res, next);
});
passport.serializeUser((user , cb)=>{
  cb(null , user.id)
});
passport.deserializeUser(async(id, cb)=>{
  try {
    const result = await db.query(`SELECT * FROM users WHERE id=$1`, [id]);
    cb(null , result.rows[0]);
  } catch (error) {
    cb(error)
  }
});
  passport.use(
    new Strategy(async function verify(username,password,cb) {
        try {
    const result = await db.query(`SELECT * FROM users WHERE email=$1`,[username])
    if (result.rows.length>0) {
      const user = result.rows[0]
       const savedHashedPassword = user.password_hash
       bcrypt.compare(password , savedHashedPassword,(err , result)=>{
        if (err) {
          console.log("error compairing password" , err)
          console.log("error compairing password!")
           return cb(err);
        } else {
          if (result) {
            // res.status(200).send("login page is ok!!")
            console.log("authorized!")
             return cb(null , user);
          } else {
//             res.status(401).json({
//     message: "Incorrect password"
// });
 return cb(null , false);
console.log("Incorrrect Password!")

          }
          
        }
       })
  
    } else {
//       res.status(404).json({
//     message: "User not found"
// });
      // console.log("User not found!");
       return cb("User not found");
    }
   
  } catch (error) {
     return cb(error);
  }
    })
  )


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
       WHERE user_id = $1
       AND EXTRACT(MONTH FROM expense_date)::int = $2
       AND EXTRACT(YEAR FROM expense_date)::int = $3`,
      [req.user.id, month, year]
    );
     total = await db.query(
    `SELECT SUM(amount) AS total_expense
     FROM data
     WHERE user_id = $1
     AND EXTRACT(MONTH FROM expense_date)::int = $2
       AND EXTRACT(YEAR FROM expense_date)::int = $3`,
    [req.user.id, month, year]
);



  
  } else if (month > 0) {
    expenses = await db.query(
      `SELECT * FROM data
      WHERE user_id = $1
       AND EXTRACT(MONTH FROM expense_date)::int = $2`,
      [ req.user.id , month]
    );
        total = await db.query(
    `SELECT SUM(amount) AS total_expense
     FROM data
     WHERE user_id = $1
     AND EXTRACT(MONTH FROM expense_date)::int = $2`,
    [req.user.id , month]
);

  
  } else if (month === 0 && year) {
    expenses = await db.query(
      `SELECT * FROM data
      WHERE user_id = $1
       AND EXTRACT(YEAR FROM expense_date)::int = $2`,
      [req.user.id , year]
    );
    total = await db.query(
    `SELECT SUM(amount) AS total_expense
     FROM data
     WHERE user_id = $1
     AND EXTRACT(YEAR FROM expense_date)::int = $2`,
    [req.user.id, year]
);
  
  } else if (year) {
    expenses = await db.query(
      `SELECT * FROM data
      WHERE user_id = $1
       AND EXTRACT(YEAR FROM expense_date)::int = $2`,
      [req.user.id, year]
    );

  
  } else {
    expenses = await db.query(`SELECT * FROM data WHERE user_id = $1`,[req.user.id]);
        total = await db.query(
    `SELECT SUM(amount) AS total_expense
     FROM data WHERE user_id = $1`,[req.user.id]);
   
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
    const user = req.user.id
    // console.log(req.body)
    try {
       const result = await db.query("INSERT INTO data(user_id ,title , category , amount , expense_date) VALUES($1 , $2 , $3 , $4 , $5) RETURNING *",
            [user , title , category , amount , expense_date]
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
    const user = req.user.id
    await db.query("UPDATE data SET title = $1 , category = $2 , amount = $3 , expense_date = $4 WHERE id=$5 AND user_id = $6",
        [title , category , amount , expense_date , id , user]
       
    );
     res.json({message:"Updated successfully!"})
} catch (error) {
    res.sendStatus(500).json({message:"Error updating data!"})
}
});
app.delete("/data/:id" , async(req, res)=>{
    try {
         const id = req.params.id
         const user = req.user.id
    await db.query("DELETE FROM data WHERE id=$1 AND user_id = $2",[id , user]);
    res.json({message:"Deleted successfully!"});
    } catch (error) {
        res.sendStatus(500).json({message:"Error deleting the data!"});
    }
   
});

app.listen(port ,"0.0.0.0" ,  ()=>{
    console.log(`this app is listeninig on ${port}!`);
});
