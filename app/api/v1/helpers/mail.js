const sgMail = require('@sendgrid/mail');
const dotenev = require('dotenv');
dotenev.config();

sgMail.setApiKey(process.env.EMAIL_KEY);


module.exports = sgMail;