const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vkedia@uwaterloo.ca',
        subject: 'Welcome to the App!',
        text: `welcome to the app, ${name}. Let me know how you get along with the app`,
        html: '<h1>HELLO</h1>'
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vkedia@uwaterloo.ca',
        subject: 'Sorry to see you go!',
        text: `We are to sorry to see you, ${name}. Is there anything we could have done to keep you with us?`,
        html: '<h1>BYE</h1>'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}