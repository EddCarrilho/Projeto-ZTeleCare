require("dotenv").config()
const express = require("express")
const router = require("./routes/usuario/user/users.js");
const routerPersonal = require("./routes/usuario/personaldata/personaldata.js");
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/users/",router);
app.use("/api/v1/personaldata/",routerPersonal);

app.listen(process.env.HOST_PORT,()=>{
    console.log(`Servidor online em ${process.env.HOST_NAME}:${process.env.HOST_PORT}`);
});
