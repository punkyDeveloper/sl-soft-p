/* eslint-disable no-unused-vars */
const nodemailer = require('nodemailer');
const usuariomodel = require('../data-access/data.usuario');
const servicioCorreo = require('../../middleware/correo');
const bcryptjs = require('bcryptjs');
const log = require('../../middleware/logs');

exports.fromularioRecuperar = (req, res) => {
  res.render('formularioCorreoContraseña');
};

exports.rcontrasena = async (req, res) => {
  try {
    const {email} = req.body;
    const correo1 = {email};
    const correo = {email: 1};
    const usuarioA = await usuariomodel.buscarUsuarioLogin(correo1, correo);

    if (!usuarioA) {
      return res.status(500).send('no conside');
    } else {
      const correo = req.body.email;
      await servicioCorreo.sendEmail(correo, 'puedes cambiar tu contraseña', `Para actualizar la contraseña, ingresa aquí: http://localhost:6700/v1/recuperar1/${usuarioA.id}`);
    }
    res.send('<script>alert("Correo enviado"); window.location.href="/v1/sl-inicio";</script>');
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send('Ocurrió un error al procesar la solicitud.');
  }
};


exports.nuevaContraseña = async (req, res) => {
  try {
    const id = req.params.id;
    const idUsuario = await usuariomodel.busquedaId(id);
    res.render('formularioActualizarContraseña',
        {idUsuario: idUsuario});
  } catch (error) {
    console.log(error);
  }
};

exports.cambiarContraseña = async (req, res)=>{
  try {
    const id =req.params.id;
    const passwordEncriptada = await bcryptjs.hash(req.body.contrasenaNueva, 8);

    const cambiarContraseñaUsuario = await usuariomodel.actualizarContraseña(id,
      
        {password: passwordEncriptada},
    );
    if (cambiarContraseñaUsuario) {
      res.redirect('/v1/sl-inicio');
    } else {
      res.send('error en el servidor de cambiar contraseña');
    }
  } catch (error) {
    console.log(error);
  }
};
