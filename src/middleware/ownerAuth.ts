import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma"

const ownerAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.ownerToken

    if (!token) throw new Error("Unauthenticated")

    const { property: email }: any = jwt.verify(token, process.env.JWT_SECRET!)

    const owner = await prisma.owner.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        businessName: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!owner) throw new Error("Unauthenticated")

    res.locals.owner = owner

    return next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: err.message })
  }
}

export default ownerAuth
