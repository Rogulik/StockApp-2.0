import { Restaurant } from "@prisma/client"
import { Request, Response, Router } from "express"
import prisma from "../lib/prisma"
import ownerAuth from "../middleware/ownerAuth"
import checkForErrors from "../middleware/checkForErrors"
import { restaurantValidation } from "../utils/validationRules"

//get owner restaurants
const getRestaurants = async (_: Request, res: Response) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { ownerId: res.locals.owner.id },
    })

    if (!restaurants) {
      return res
        .status(404)
        .json({ restaurants: "There is no restaurants created for You yet" })
    }

    return res.json(restaurants)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
}
//get single owner restaurant
const getRestaurant = async (req: Request, res: Response) => {
  const { id }: any = req.params.id
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        owner: res.locals.owner,
        id,
      },
      include: {
        menus: true,
        dishes: true,
        employees: true,
      },
    })

    if (!restaurant) {
      return res
        .status(404)
        .json({ restaurant: "There is no restaurant created for You yet" })
    }

    return res.json(restaurant)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
}
//create owner restaurant
const createManyRestaurants = (req: Request, res: Response) => {
  const newRestaurants = req.body.map(({ name, location }: Restaurant) => {
    return prisma.restaurant.create({
      data: {
        name,
        location,
        ownerId: res.locals.owner.id,
      },
    })
  })

  Promise.any(newRestaurants)
    .then((data) => {
      return res.json(data)
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ error: "Something went wrong" })
    })
}
//delete owner restaurant

const deleteRestaurant = async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const deletedRestaurant = await prisma.restaurant.delete({
      where: {
        id,
      },
    })

    if (deletedRestaurant?.ownerId !== res.locals.owner.id) {
      return res.status(401).json({ error: "Unauthorized to continue" })
    }
    return res.json(deletedRestaurant)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: "Restaurant not found" })
  }
}

const updateRestaurant = async (req: Request, res: Response) => {
  const { name, location, id } = req.body
  try {
    const updatedRestaurant = await prisma.restaurant.update({
      data: {
        name,
        location,
      },
      where: {
        id,
      },
    })

    if (updatedRestaurant?.ownerId !== res.locals.owner.id) {
      return res.status(401).json({ error: "Unauthorized to continue" })
    }
    return res.json(updatedRestaurant)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: "Restaurant not found" })
  }
}

const router = Router()

router.get("/", ownerAuth, getRestaurants)
router.get("/:id", ownerAuth, getRestaurant)
router.post(
  "/",
  ownerAuth,
  restaurantValidation,
  checkForErrors,
  createManyRestaurants
)
router.delete("/:id", ownerAuth, deleteRestaurant)
router.patch("/:id", ownerAuth, updateRestaurant)

export default router
