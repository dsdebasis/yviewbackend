import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_GMAIL_USER,
    pass: process.env.SMTP_GMAIL_PASS

  }

})

const sendMail = async function (to, sub, msg) {
  try {
    await new Promise((resolve, reject) => {

      transport.sendMail({
        from: process.env.SMTP_GMAIL_USER,
        to: to,
        subject: sub,
        text: msg,
        html: "<h1>hellow</h1>"
      }, function (error, info) {
        if (error) {
          console.log("error while sending mail", error)
          reject(error)
        } else {
          console.log("successfully email sent to client")
          resolve(info)
        }
      })
    })
  } catch (error) {
    console.log("error while sending messaging", error)
  }
}



export { sendMail }