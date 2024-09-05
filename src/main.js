require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors());

app.listen(process.env.HOST_PORT,()=>{
    console.log(`Servidor online em ${process.env.HOST_NAME}:${process.env.HOST_PORT}`);
});
