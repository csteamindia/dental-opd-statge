import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',       // e.g., smtp.gmail.com or your SMTP host
  port: 465,                      // or 465 for SSL
  secure: true,                  // true for port 465, false for others
  auth: {
    user: 'support@oralstop.com',     // your email
    pass: 't2@Uwwk4kk.!.BR'         // your email password or app password
  }
});

// Send mail
const testMail = async (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error:', error);
      }
      console.log('Email sent:', info.response);
    });
}

export { testMail }