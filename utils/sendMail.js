import nodemailer from "nodemailer"
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass:process.env.GMAIL_PASS
  },
})
const sendMail = async function (to, subject, message) {
  try {
    await new Promise((resolve, reject) => {

      transport.sendMail({
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        text: message,
      }, function (error, info) {
        if (error) {
          console.log("error while sending mail", error)
          reject(error.message)
        } else {
          // console.log("successfully email sent to client")
          resolve(info)
        }
      })
    })
  } catch (error) {
    console.log("error while sending messaging", error)
  }
}

export { sendMail }