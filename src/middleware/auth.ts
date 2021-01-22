import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma"

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.ownerToken

    if (!token) throw new Error("Unauthenticated")

    const { email }: any = jwt.verify(token, process.env.JWT_SECRET || "")

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

    if (!token) throw new Error("Unauthenticated")

    res.locals.owner = owner

    return next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: err.message })
  }
}

export default auth
