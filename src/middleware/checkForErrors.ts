import { NextFunction, Request, Response } from "express"

import { validationResult } from "express-validator"

const simpleValidationResult = validationResult.withDefaults({
  formatter: (err) => err.msg,
})

const checkForErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = simpleValidationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped())
  }
  next()
}

export default checkForErrors
