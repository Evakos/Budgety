require('dotenv').config();

const smKey = process.env.SENDGRID_API_KEY;
//console.log('key is:' + apiKey);

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(smKey);
const msg = {
  to: 'support@evakos.io',
  from: 'info@evakos.io',
  subject: 'Budgety',
  text: 'A mail from Budgety',
  html: '<strong>Thanks for signing up!</strong>'
};
//ES6
//sgMail.send(msg).then(() => {}, console.error);
//ES8
(async () => {
  try {
    await sgMail.send(msg);
  } catch (err) {
    console.error(err.toString());
  }
})();
