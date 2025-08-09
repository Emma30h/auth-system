import app from "./app.js";
import { connectDB } from "./db/dbConnection.js";

//Server 
const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server on port ${PORT}`)
});