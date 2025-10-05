const express = require("express");
require("dotenv").config()
const cors = require("cors")
const config = require("./db/db.config");
const Routes = require("./Routes/Routes")

const app = express();

app.use(express.json({limit:"16kb"}))
app.use(cors({methods:["GET","POST","DELETE","PUT"],allowedHeaders:["Content-Type","Authorization"]}))

app.use("/api",Routes)
app.get("/",(req,resp)=>resp.status(200).send({message:"Server Health is okay"}))

const PORT = process.env.PORT || 4000
const start = () => {
  try {
    config(process.env.MONGO_URL).then(app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  } catch (error) {
    console.log("Error Occured in connecting...",error); 
  }
}
start()