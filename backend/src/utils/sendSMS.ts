import twilio from 'twilio'

export const sendSMS = async () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = twilio(accountSid, authToken)

  const message = await client.messages.create({
    body: 'Hello Favour, Just testing the sms..',
    from: process.env.TWILIO_PHONE_NUMBER,
    to: process.env.MY_PHONE_NUMBER as string
  })

}
