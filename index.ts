import express from "express"
import restaurantsRoutes from "./routes/restaurants.js"
import cuisinesRouter from "./routes/cuisines.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use("/restaurants", restaurantsRoutes)
app.use("/cuisines", cuisinesRouter)


app.use(errorHandler)


app.listen(PORT, () => {
    console.log("Application running on port ", PORT)
}).on("error", (error) => {
    throw new Error(error.message)
})

