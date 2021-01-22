import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import authOwnerRoutes from "./routes/authOnwer"
import cookieParser from "cookie-parser"

dotenv.config()
const PORT = process.env.PORT

const app = express()

//functional middlewares
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())

//app middlewares
app.use("/api/owner", authOwnerRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
