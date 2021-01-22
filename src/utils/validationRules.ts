import { body } from "express-validator"

export const ownerRegisterValidation = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("name")
    .isLength({ min: 1 })
    .withMessage("Name must not be empty")
    .trim(),
  body("name")
    .isLength({ min: 1 })
    .withMessage("Business name must not be empty")
    .trim(),
  body("password")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
    .withMessage(
      "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long"
    ),
]

export const loginValidation = [
  body("email")
    .isLength({ min: 1 })
    .withMessage("Email must not be empty")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .isLength({ min: 1 })
    .withMessage("Password must not be empty"),
]
