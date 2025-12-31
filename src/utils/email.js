import nodemailer from "nodemailer";
import config from "../../config/config.js";

console.log("smtp user name: ", config.app.smtpUsrName);
console.log("smtp password: ", config.app.smtpPass);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: config.app.smtpUserName,
        pass: config.app.smtpPass,
    },
});

const verifyAndSendEmail = async emailData => {
    try {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: `${config.app.smtpUserName}`, // sender address
            to: emailData.to, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.html, // html body
        });
        // console.log("info>>>>>>>> ", info);
        
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        return info;
    } catch (error) {
        console.error('Email verification failed: ', error);
        throw error;
    }
};

export default verifyAndSendEmail;