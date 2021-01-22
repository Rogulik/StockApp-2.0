import { Owner } from "@prisma/client"
import { Request, Response, Router } from "express"
import bcrypt from "bcrypt"
import prisma from "../lib/prisma"
import checkForErrors from "../middleware/checkForErrors"
import {
  ownerRegisterValidation,
  loginValidation,
} from "../utils/validationRules"
import setCookie from "../utils/setCookie"
import auth from "../middleware/auth"

const register = async (req: Request, res: Response) => {
  const { name, email, password, businessName }: Owner = req.body
  try {
    const existingOwner = await prisma.owner.findFirst({
      where: { email },
    })
    if (existingOwner) {
      return res.status(400).json({ owner: "Account already exists" })
    }

    const owner = await prisma.owner.create({
      data: {
        name,
        email,
        password,
        businessName,
      },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    })
    return res.json(owner)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
}

const login = async (req: Request, res: Response) => {
  const { email, password }: Owner = req.body
  try {
    const ownerPassword: any = await prisma.owner.findFirst({
      where: { email },
      select: { password: true },
    })
    const owner = await prisma.owner.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    if (!owner) {
      return res.status(404).json({ owner: "Owner not found" })
    }

    const passwordMatch = await bcrypt.compare(password, ownerPassword.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: "Wrong credentials" })
    }

    res.set("Set-Cookie", setCookie(email, "ownerToken"))

    return res.json(owner)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong" })
  }
}

const me = async (_: Request, res: Response) => {
  return res.json(res.locals.owner)
}

const logout = (_: Request, res: Response) => {
  res.set("Set-Cookie", setCookie("", "ownerToken", false))

  return res.status(200).json({ success: true })
}

const router = Router()

router.post("/register", ownerRegisterValidation, checkForErrors, register)
router.get("/login", loginValidation, checkForErrors, login)
router.get("/me", auth, me)
router.get("/logout", auth, logout)

export default router
