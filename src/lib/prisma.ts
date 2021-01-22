import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  if (
    (params.model === "Owner" || params.model === "Employee") &&
    params.action === "create"
  ) {
    params.args.data.password = await bcrypt.hash(params.args.data?.password, 6)
  }

  return next(params)
})

export default prisma
