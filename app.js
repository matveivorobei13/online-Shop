require('dotenv').config()
const express = require("express")
const cookieParser = require('cookie-parser');
const cors = require("cors")
const authRoutes = require('./routes/auth_rout')
const categoriesRouter = require("./routes/categories_rout")

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/categories", categoriesRouter)

app.listen(process.env.PORT, () => console.log("Server is running on port 3000"));
