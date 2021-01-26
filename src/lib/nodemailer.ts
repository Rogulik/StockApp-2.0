import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

export default async (
  email: string,
  name: string,
  password: string,
  owner: string
) => {
  try {
    let transporter: Mail = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.NODEMAILER_USER, // generated ethereal user
        pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    await transporter.sendMail(
      {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: `Invitation from ${owner} to join Stock App`, // Subject line
        text: `Hello ${name}`, // plain text body
        html: `<div><p>Your email account: ${email}</p><p>Your password: ${password}</p></div>`, // html body
      },
      (err, info) => {
        if (err) {
          console.log(err)
          return
        }
        console.log(info?.response)
      }
    )
  } catch (err) {
    console.log(err)
  }
}
