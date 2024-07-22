import nodemailer from 'nodemailer'

type MailOptionType = {
  email: string | undefined
  subject: string
  html: string
  attachments?: [
    {
      filename: string,
      path: string
    }
  ]
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
    from: `"Tonzai Expense Tracker "`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    attachments: [
      {
        filename: options && options.attachments && options.attachments[0].filename,
        path: options && options.attachments && options.attachments[0].path
      }
    ]
  }
  await transporter.sendMail(mailOptions)
}

