const datosUsuario = require('../data-access/data.usuario');
const datosCliente = require('../data-access/data.clientes');
const datosEmpleado = require('../data-access/data.empleados');
const datosAdministrador = require('../data-access/data.administrador');
const bcryptjs = require('bcryptjs');
const log = require('../../middleware/logs');

// login

exports.login = async (req, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const {email, password} = req.body;
    const correoElectronico = {email};
    
    const data = {email: 1, _id: 1, password: 1, rol: 1};
    const validarDatos = await datosUsuario.buscarUsuarioLogin(correoElectronico, data);

    if (validarDatos.exito === false) {
      res.render('errorPassword', {email: ''});
      log.registrologs('No se encontro el correo ingresado')
    } else {
      const comparePassword = await bcryptjs.compare(req.body.password, validarDatos.password);
  
      if (validarDatos.email === correoElectronico.email) {
        // Verificar la contraseña (descomenta esta parte cuando tengas la lógica)
        if (comparePassword) {
          res.cookie('rol', validarDatos.rol, {httpOnly: true});
  
          if (validarDatos.rol === 'cliente') {
            const cliente = await datosCliente.buscarClientes({email: validarDatos.email});
  
            res.cookie('rol', 'cliente', {httpOnly: true});
            res.cookie('misDatos', JSON.stringify(cliente.clientes), {httpOnly: true});
  
            res.redirect('/v1/sl-ropa');
          } else if (validarDatos.rol === 'empleado') {
            const empleado = await datosEmpleado.buscarEmpleados({email: validarDatos.email});
            res.cookie('rol', 'empleado', {httpOnly: true});
            res.cookie('misDatos', JSON.stringify(empleado.empleados), {httpOnly: true});
            res.redirect('/v1/registroProducto');
          } else if (validarDatos.rol === 'administrador') {
            const administrador = await datosAdministrador.buscarAdministrador({email: validarDatos.email});
            res.cookie('rol', 'administrador', {httpOnly: true});
            res.cookie('misDatos', JSON.stringify(administrador.administrador), {httpOnly: true});
            res.redirect('/v1/registroProducto');
          } else {
            res.status(500).json({message: 'El usuario no existe'});
          }
        } else {
          res.render('errorPassword', {email: req.body.email});
        }
      }
    }

  } catch (error) {
    // console.log(error);
    res.redirect('/v1/error');
  }
};
