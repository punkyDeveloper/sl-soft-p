const datos = require('../data-access/data.clientes');
const datoEmpleado = require('../data-access/data.empleados');
const datoAdministrador = require('../data-access/data.administrador');
const datosUsuario = require('../data-access/data.usuario');
const servicioCorreo = require('../../middleware/correo');
const bcryptjs = require('bcryptjs');
const log = require('../../middleware/logs');

const path = require('path');
const fs = require('fs-extra');


exports.formularioClientes = (req, res) => {
  res.render('registroCliente');
};

exports.perfilCliente = async (req, res) => {
  const rol = req.cookies.rol;
  console.log(rol);
  const misDatosCookie = req.cookies.misDatos;
  if (rol === undefined) {
    res.render('perfilCliente', {rol: null, misDatos: null});
  } else if (rol === 'cliente') {
    const idCliente = JSON.parse(misDatosCookie).map((dato) => dato._id);
    const infoCliente = await datos.buscarClientes({_id: idCliente});
    res.render('perfilCliente', {rol: rol || null, misDatos: infoCliente.clientes});
  } else if (rol === 'empleado') {
    const idEmpleado = JSON.parse(misDatosCookie).map((dato) => dato._id);
    const infoEmpleado = await datoEmpleado.buscarEmpleados({_id: idEmpleado});
    res.render('perfilCliente', {rol: rol || null, misDatos: infoEmpleado.empleados});
  } else if (rol === 'administrador') {
    const idAdministrador = JSON.parse(misDatosCookie).map((dato) => dato._id);
    const infoAdministrador = await datoAdministrador.buscarAdministrador({_id: idAdministrador});
    res.render('perfilCliente', {rol: rol || null, misDatos: infoAdministrador.administrador});
  };
};

exports.listadoClientes = async (req, res) => {
  try {
    const clientes= await datos.buscarClientes();
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;

    if (rol === undefined) {
      res.render('index', {
        clientes: clientes.clientes,
        datos: clientes.exito,
        rol: rol || null,
        misDatos: null,
      });
    } else {
      res.render('listadoClientes', {
        clientes: clientes.clientes,
        datos: clientes.exito,
        rol: rol,
        misDatos: JSON.parse(misDatosCookie),
      });
    }
  } catch (error) {
    res.redirect('/v1/error');
    console.log(error);
  };
};

exports.agregarClientes = async (req, res) => {
  try {
    const correoElectronico = {email: req.body.email};
    const verificarUsuario = await datosUsuario.buscarUsuario(correoElectronico);
    const verificarCliente = await datos.buscarClientes(correoElectronico);

    if (verificarCliente.exito === true || verificarUsuario.exito === true) {
      return res.send('<script>alert("EL correo ya esta en uso"); window.history.back();</script>');
    } else {
      const agregarCliente = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        documento: req.body.documento,
        celular: req.body.celular,
        direccion: req.body.direccion,
        email: req.body.email,
      };

      if (req.file) {
        agregarCliente.path = '../../static/fotos/' + req.file.filename;
      }
      if ( agregarCliente.documento.length < 7) {
        res.send('<script>alert("El documento debe tener al menos 7 dígitos"); window.history.back();</script>');
      } else if ( agregarCliente.celular.length < 10) {
        res.send('<script>alert("El número de contacto debe tener al menos 10 dígitos"); window.history.back();</script>');
      } else {
        const datosGuardar = await datos.agregarC(agregarCliente);
  
        if (datosGuardar.exito === false) {
          return res.send('<script>alert("No se pudo guardar el Cliente"); window.history.back();</script>');
        } else {
          const passwordEncriptada = await bcryptjs.hash(req.body.password, 8);
          const agregarUsuario = {
            _id: datosGuardar.cliente._id,
            rol: 'cliente',
            password: passwordEncriptada,
            email: req.body.email,
          };
          const correo = req.body.email;
          await servicioCorreo.sendEmail(correo, 'Bienvenido a SL-SOFT ', `Bienvenid@ ${agregarCliente.nombre} ${agregarCliente.apellido}  a SL-SOFT ahora eres parte de nosotros`);
          const cliente = await datosUsuario.agregarUsuario(agregarUsuario);
          if (!cliente) {
            return res.send('<script>alert("No se pudo guardar el Usuario"); window.history.back();</script>');
          } else {
            console.log(datosGuardar.cliente);
            const cliente = await datos.buscarClientes({_id: datosGuardar.cliente._id});
            res.cookie('rol', 'cliente', {httpOnly: true});
            res.cookie('misDatos', JSON.stringify(cliente.clientes), {httpOnly: true});
            res.redirect('/v1/sl-ropa');
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Ocurrió un error'});
  }
};


exports.buscarClientes = async (req, res) => {
  try {
    const filtro = {email: req.body.email};

    const usuario = await datos.buscarClientes(filtro);
    if (usuario) {
      res.status(200).json({cliente: usuario});
    } else {
      res.status(500).json({message: 'No se pudo encontrar los datos del cliente'});
    }
  } catch (error) {
    console.log(error);
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    const filtro = {_id: req.params.id};
    const Cliente = await datos.eliminarC(filtro);
    
    if (Cliente.exito === false) {
      return res.send(`<script>alert("No fue posible eliminar el perfil"); window.history.back();</script>`);
    } else {

      const usuario = await datosUsuario.eliminarUsuario(filtro);

      if (Cliente.cliente.path !== '../../static/img/perfil1.png') {
        // Verificar si el cliente tiene una imagen antes de intentar borrarla
          await fs.unlink(path.resolve(`frontend/static/fotos/${Cliente.cliente.path}`));
      } else {
        console.log('El cliente no tiene una imagen para borrar.');
      }

      if (usuario.exito === false) {
        res.status(500).json({mensaje: 'No fue posible eliminar el usuario'});
      } else {
        const cookiesABorrar = ['rol', 'misDatos'];

        cookiesABorrar.forEach((cookie) => {
          res.clearCookie(cookie);
        });
        
        res.redirect('/v1/sl-inicio');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({mensaje: 'Ocurrió un error'});
  }
};


exports.actualizarClientes = async (req, res) => {
  try {
    const filtro = {_id: req.body.idnuevo};
    const informacionCliente = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      documento: req.body.documento,
      celular: req.body.celular,
      email: req.body.email,
      direccion: req.body.direccion,
    };

    if (req.file) {
      const nuevaRutaImagen = '../../static/fotos/' + req.file.filename;
      const rutaExistente = `frontend/static/fotos/${req.body.rutaImagenVieja}`;
     
      if (req.body.rutaImagenVieja && req.body.rutaImagenVieja !== nuevaRutaImagen) {
        if(req.body.rutaImagenVieja == '../../static/img/perfil1.png') {
          console.log('El cliente no tiene una imagen para borrar.');
        } else {
          // Elimina la imagen antigua
          fs.unlink(rutaExistente, (unlinkError) => {
            if (unlinkError) {
              console.error('Error al eliminar el La foto:', unlinkError);
            } else {
              console.log('foto eliminado con éxito');
            }
          });
        } 
      } else {
        console.log('El cliente no tiene una imagen para borrar.');
      }

      informacionCliente.path = nuevaRutaImagen;
    }


    const cliente = await datos.actualizarC(filtro, informacionCliente);
    if (cliente.exito === false) {
      return res.send('<script>alert("No fue Posile actualizar el Cliente"); window.history.back();</script>');
    }

    const datosUsuarioActualizados = {
      email: req.body.email,
    };

    await datosUsuario.actualizadoDato(filtro, datosUsuarioActualizados);

    if (datosUsuario.exito === false) {
      console.log('No se pudo actualizar el usuario');
      return res.send(`<script>alert("${datosUsuario.error}"); window.history.back();</script>`);
    } else if (datosUsuario.error) {
      return res.send(`<script>alert("${datosUsuario.error}"); window.history.back();</script>`);
    }

    console.log('Usuario actualizado con éxito');

    res.redirect('/v1/perfilCliente');
  } catch (error) {
    console.error(error);
    res.status(500).json({mensaje: 'Ocurrio un error'});
  }
};

exports.borrarCookie = (req, res) => {
  const cookiesABorrar = ['rol', 'misDatos'];

  // Iterar sobre la lista y borrar cada cookie
  cookiesABorrar.forEach((cookie) => {
    res.clearCookie(cookie);
  });

  // Redirigir al usuario a la página de inicio después de borrar las cookies
  res.redirect('/v1/sl-ropa');
};
