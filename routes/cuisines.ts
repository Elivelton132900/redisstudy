import express, { type NextFunction, type Response, type Request } from "express"
import { initializeRedisClient } from "../utils/client.js"
import { cuisineKey, cuisinesKey, restaurantKeyById } from "../utils/keys.js"
import { successResponse } from "../utils/responses.js"

const router = express.Router()

router.get("/", async(req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await initializeRedisClient()
        const cuisines = await client.sMembers(cuisinesKey)
        return successResponse(res, cuisines)
    } catch(error) {
        next(error)
    }
})

router.get("/:cuisine", async(req: Request, res: Response, next: NextFunction) => {

    const { cuisine } = req.params

    try {

        if (!cuisine || Array.isArray(cuisine)) {
            throw new Error("Cuisine not found")
        }

        const client = await initializeRedisClient()
        const restaurantIds = await client.sMembers(cuisineKey(cuisine)) // o mesmo que client.sMembers("bites:cuisine:brasilian")
        const restaurants = await Promise.all(
            restaurantIds.map(id => client.hGet(restaurantKeyById(id), "name"))
        )
        return successResponse(res, restaurants)
    } catch(error) {
        next(error)
    }
})

export default router