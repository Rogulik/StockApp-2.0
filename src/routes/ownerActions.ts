import { Employee } from "@prisma/client"
import { Request, Response, Router } from "express"
import prisma from "../lib/prisma"
import checkForErrors from "../middleware/checkForErrors"
import { employeeRegisterValidation } from "../utils/validationRules"
import ownerAuth from "../middleware/ownerAuth"
import sendEmail from "../lib//nodemailer"
import generator from "generate-password"

const registerEmployee = (req: Request, res: Response) => {
  const newEmployees = req.body.map(({ name, email, position }: Employee) => {
    const password = generator.generate({
      length: 8,
      numbers: true,
      symbols: true,
    })

    sendEmail(email, name, password, res.locals.owner.name)

    return prisma.employee.create({
      data: {
        name,
        email,
        password,
        position,
        bossId: res.locals.owner.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        bossId: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    })
  })

  Promise.all(newEmployees)
    .then((data) => {
      return res.json(data)
    })
    .catch((err) => {
      console.log(err)
      return res
        .status(400)
        .json({ error: "One of the employee account already exists" })
    })
}

const router = Router()

router.post(
  "/register-employee",
  ownerAuth,
  employeeRegisterValidation,
  checkForErrors,
  registerEmployee
)

export default router
