/* eslint-disable linebreak-style */
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.CORREO_INFO,
    pass: process.env.DB_SEGURA,
  },
});
exports.correDocumento = async (destinatary, subject, body, nombreDocumento, rutaPDF) => {
  try {
    const mailOptions = {
      from: process.env.CORREO_INFO,
      to: destinatary,
      subject: subject,
      text: body,
      attachments: [
        {
          filename: nombreDocumento,
          path: rutaPDF,
        },
      ],
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  };
};

exports.sendEmail = async (destinatary, subject, body, nombreDocumento, rutaPDF) => {
  const mailOptions = {
    from: process.env.CORREO_INFO,
    to: destinatary,
    subject: subject,
    text: body,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};
// const emailSent = await servicioCorreo.sendEmail(email, 'Bienvenido a SL-SOFT ', `Bienvenid@ ${datosEmpleado.nombre} ${datosEmpleado.apellido}  a SL-SOFT ahora eres parte de nosotros y ocupas el cargo de ${datosEmpleado.cargo}`);
