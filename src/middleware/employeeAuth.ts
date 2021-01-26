import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma"

const employeeAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.employeeToken

    if (!token) throw new Error("Unauthenticated")

    const { property: email }: any = jwt.verify(token, process.env.JWT_SECRET!)

    const employee = await prisma.employee.findFirst({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        bossId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!employee) throw new Error("Unauthenticated")

    res.locals.employee = employee

    return next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: err.message })
  }
}

export default employeeAuth
