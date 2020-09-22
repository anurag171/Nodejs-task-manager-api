const sgMail = require('@sendgrid/mail')
const sendGridApiKey=process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendGridApiKey)


const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        from:"anurag171@gmail.com",
        to:email,
        subject:"Thanks for joining in",
        text:`Welcome to the app ${name} !. Let me know how do you get along !`
    })
}

const sendFarewellEmail = (email,name)=>{
    sgMail.send({
        from:"anurag171@gmail.com",
        to:email,
        subject:"Hope to see you around again in !",
        text:`Thanks for using the app ${name} !. We will miss you. In case you want to come back you can contact our support.
                if you have any feedback do let us know.Happy to hear from you again.`
    })
}
module.exports={
    sendWelcomeEmail,
    sendFarewellEmail

}
