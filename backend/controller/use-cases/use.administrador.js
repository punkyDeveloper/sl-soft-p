const log = require('../../middleware/logs');
exports.agregarAdministrador = async (req, res) => {
  try {
    const correoElectronico = {email: req.body.email};

    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;
    const idUsuario = JSON.parse(misDatosCookie).map((dato) => dato._id);

    let infoUsuario;
    if (rol === 'administrador') {
      const info = await datosAdministrador.buscarAdministrador({ _id: idUsuario });
      if (info.administrador.length > 0) {
        
        infoUsuario = info.administrador[0].email;
      } else {
      
        console.error('Administrador no encontrado');
      }
    }

    // verifique primero el correo electrónico del usuario en la base de datos
    const verificarAdministrador = await datosAdministrador.buscarAdministrador(correoElectronico);
    const verificarUsuario = await datosUsuario.buscarUsuario(correoElectronico);

    if (verificarUsuario.exito === true || verificarAdministrador.exito === true) {
      return res.status(500).json({mensaje: 'El email ya está en uso'});
    }

    const agregarAdministrador = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      documento: req.body.documento,
      email: req.body.email,
    };
    const datosGuardar = await datosAdministrador.agregarAdministrador(agregarAdministrador);

    // Verifica si el cliente se guardó correctamente
    if (datosGuardar.exito === false) {
      return res.status(500).json({mensaje: 'No fue posible registrar el cliente'});
    }
    // Hash de la contraseña
    const passwordEncriptada = await bcryptjs.hash(req.body.password, 8);
    // Agrega el usuario solo si el cliente se guardó correctamente
    const agregarUsuario = {
      rol: 'administrador',
      password: passwordEncriptada, // Almacenar la contraseña hasheada en la base de datos
      email: req.body.email,
      _id: datosGuardar._id,
    };

    // eslint-disable-next-line no-unused-vars
    const correo = req.body.email;
    // await servicioCorreo.sendEmail(correo, 'Bienvenido a SL-SOFT ', `Bienvenid@ ${agregarAdministrador.nombre} ${agregarAdministrador.apellido}  a SL-SOFT ahora eres parte de nosotros`);

    const cliente = await datosUsuario.agregarUsuario(agregarUsuario);


    if (!cliente) {
      return res.status(500).json({mensaje: 'No fue posible guardar el usuario'});
    }

    // Resto del código que verifica datosEmpleado y registra empleado
    log.registrologs(`${infoUsuario} agrego un administrador ${cliente.email}`)
    res.send('<script>alert("Se agrego el administrador"); window.history.back();</script>');
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};
