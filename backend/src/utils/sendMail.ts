import nodemailer from 'nodemailer'

type MailOptionType = {
  email: string
  subject: string
  html: string
}

export const sendMail = async (options: MailOptionType) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  } as any)
  const mailOptions = {
    from: `"Tonzai Expense Tracker " <hoseafavour123@gmail.com>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  }
  await transporter.sendMail(mailOptions)
}
