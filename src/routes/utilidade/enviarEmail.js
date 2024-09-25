const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST_EMAIL,
            service: process.env.SERVICE,
            port: 587,
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASSWORD_EMAIL,
            },
        });

        await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("Email enviado com sucesso");
    } catch (error) {
        console.log(error, "Falha no envio do e-mail");
    }
};

module.exports = sendEmail;