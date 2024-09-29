const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST_EMAIL,
            service: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASSWORD_EMAIL,
            },
            tls: {
                rejectUnauthorized: false 
            }
        });
        const mailOption = {
            from: process.env.USER_EMAIL,
            to: option.email,
            subject: option.subject,
            html: option.message,
        };
        await transporter.sendMail(mailOption, (err, info) => {
            if (err) console.log(err);
        });
        console.log("Email enviado com sucesso");
    } catch (error) {
        console.log("Falha no envio do e-mail", error);
    }
};

const mailTemplate = (content, buttonUrl, buttonText) => {
    return `<!DOCTYPE html>
    <html>
    <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
      <div
        style="
          max-width: 400px;
          margin: 10px;
          background-color: #fafafa;
          padding: 25px;
          border-radius: 20px;
        "
      >
        <p style="text-align: left;">
          ${content}
        </p>
        <a href="${buttonUrl}" target="_blank">
          <button
            style="
              background-color: #0d4354;
              border: 0;
              width: 200px;
              height: 30px;
              border-radius: 6px;
              color: #fff;
            "
          >
            ${buttonText}
          </button>
        </a>
        <p style="text-align: left;">
        Se você não conseguir clicar no botão acima, copie e cole o URL abaixo na sua barra de endereço
        </p>
        <a href="${buttonUrl}" target="_blank">
            <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">
              ${buttonUrl}
            </p>
        </a>
      </div>
    </body>
  </html>`;
  };

module.exports = { sendEmail, mailTemplate };