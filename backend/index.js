import app from "./app.js";
import { connectDB } from "./db/dbConnection.js";
import { config } from "dotenv";
config();

//Server 
const port = process.env.SERVER_PORT;

app.listen(port, ()=>{
    connectDB();
    console.log(`Server on port ${port}`)
});