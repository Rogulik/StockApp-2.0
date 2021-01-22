import jwt from "jsonwebtoken"
import cookie from "cookie"

const jwtSecret: any = process.env.JWT_SECRET

const setCookie = (
  property: string,
  cookieName: string,
  isSigning = true
): string => {
  const token = jwt.sign({ property }, jwtSecret)

  return cookie.serialize(
    cookieName,
    isSigning ? token : "",
    isSigning
      ? {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600,
          path: "/",
        }
      : {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: new Date(0),
          path: "/",
        }
  )
}

export default setCookie
