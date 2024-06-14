/* eslint-disable no-unused-vars */
const DataEmpleados = require('../data-access/data.empleados');
const DataUsuarios = require('../data-access/data.usuario');
const usuariomodel = require('../../models/usuarios.model');
const servicioCorreo = require('../../middleware/correo');
const datosAdministrador= require('../data-access/data.administrador');
const bcryptjs = require('bcryptjs');
const log = require('../../middleware/logs');

const path = require('path');
const fs = require('fs-extra');

exports.formularioEmpleado = async (req, res) => {
  try {
    const listaEmpleados= await DataEmpleados.buscarEmpleados();
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;

    if (misDatosCookie === undefined) {
      res.render('formularioEmpleado', {
        empleados: listaEmpleados.empleados,
        datos: listaEmpleados.exito,
        rol: rol || null,
        misDatos: null,
      });
    } else {
      const idAdmi = JSON.parse(misDatosCookie).map((dato) => dato._id);
      const infoAdmi = await datosAdministrador.buscarAdministrador({_id: idAdmi});
      res.render('formularioEmpleado', {
        empleados: listaEmpleados.empleados,
        datos: listaEmpleados.exito,
        rol: rol,
        misDatos: infoAdmi.administrador,
      });
    }
  } catch (error) {
    res.redirect('/v1/error');
    console.log(error);
  }
};

exports.listarEmpleado = async (req, res) => {
  try {
    const empleados = await DataEmpleados.buscarEmpleados();
    if (empleados.exito === false) {
      res.status(500).json({mensaje: 'No se encontro empleados registrados'});
    } else {
      res.status(200).json({resultados: empleados});
    }
  } catch (error) {
    res.redirect('/v1/error');
    console.log(error);
  };
};


exports.actualizarEmpleado = async (req, res) => {
  try {
    const empleadoId = req.params.id;
    const filtroEmpleado = {_id: empleadoId};

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
    
    const datosEmpleado = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      documento: req.body.documento,
      email: req.body.email,
      cargo: req.body.cargo,
    };

    console.log('estdo: '+ datosEmpleado.estado);
    if (req.file) {
      const nuevaRutaImagen = '../../static/fotos/' + req.file.filename;
      const rutaExistente = `frontend/static/fotos/${req.body.rutaImagenVieja}`;

      if (req.body.rutaImagenVieja && req.body.rutaImagenVieja !== nuevaRutaImagen) {
        if (req.body.rutaImagenVieja == '../../static/img/empleadoP.jpg'){
          console.log('No hay imagen de empleado para eliminar')
        }else{
          try {
            await fs.unlink(rutaExistente);
            console.log('Foto eliminada con éxito');
          } catch (unlinkError) {
            console.error('Error al eliminar la foto:', unlinkError);
          }
        }
      }

      datosEmpleado.path = nuevaRutaImagen;
    }

    const empleado = await DataEmpleados.actualizarEmpleados(filtroEmpleado, datosEmpleado);

    if (!empleado.exito) {
      console.log('No se pudo actualizar el empleado');
      return res.status(500).json({mensaje: 'No fue posible actualizar el empleado'});
    }

    console.log('Empleado actualizado con éxito');

    const filtroUsuario = {_id: empleadoId};

    const datosUsuarioActualizados = {
      email: req.body.email,
      password: req.body.password,
      rol: req.body.rol,
    };

    const usuario = await DataUsuarios.actualizarUsuario(filtroUsuario, datosUsuarioActualizados);

    if (!usuario) {
      console.log('No se pudo actualizar el usuario');
      return res.status(500).json({mensaje: 'No fue posible actualizar el usuario'});
    }

    console.log('Usuario actualizado con éxito');
    log.registrologs(`${infoUsuario} Actualizo el empleado: ${empleado.dato.email}`);
    res.redirect('/v1/registroEmpleado');
  } catch (error) {
    console.error(error);
    res.status(500).json({mensaje: 'Ocurrió un error'});
  }
};


exports.registrarEmpleado = async (req, res) => {
  try {
    const filtro= {email: req.body.email};
    const verificarEmpleado= await DataEmpleados.buscarEmpleados(filtro);
    const verificarUsuario= await DataUsuarios.buscarUsuario(filtro); 
    
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


    if (verificarEmpleado.exito===true || verificarUsuario.exito===true) {
      return res.send('<script>alert("El correo ya esata en uso"); window.history.back();</script>');
    } else {
      const datosEmpleado = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        documento: req.body.documento,
        email: req.body.email,
        cargo: req.body.cargo,
      };
      if (req.file) {
        datosEmpleado.path = '../../static/fotos/' + req.file.filename;
      }
      if ( datosEmpleado.documento.length < 7) {
        res.send('<script>alert("El número debe tener al menos 7 dígitos"); window.history.back();</script>');
      } else {
        const nuevoEmpleado = await DataEmpleados.registrarEmpleados(datosEmpleado);
        if (nuevoEmpleado.exito === false) {
          return res.status(500).json({mensaje: 'No fue posible registrar el empleado'});
        } else {
          const passwordEncriptada = await bcryptjs.hash(req.body.password, 8);
          const datosUsuario= {
            _id: nuevoEmpleado.empleado._id,
            email: req.body.email,
            password: passwordEncriptada,
            rol: req.body.rol,
          };
          console.log('datos enviados Usuario: '+{datosUsuario});
          const usuario= await DataUsuarios.agregarUsuario(datosUsuario);
          if (!usuario) {
            return res.status(500).json({mensaje: 'No fue posible guardar el usuario'});
          } else {
            log.registrologs(`${infoUsuario} Registro el empleado: ${usuario.email}`);
            res.redirect('/v1/registroEmpleado');
          }
        }
      }
    }
  } catch (error) {
    res.redirect('/v1/error');
    console.log(error);
  }
};


exports.eliminarEmpleado = async (req, res) => {
  try {
    const filtro = {_id: req.params.id};
    const empleado = await DataEmpleados.eliminarEmpleados(filtro);
    
    
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

    if (empleado.exito === false) {
      return res.send(`<script>alert("No fue posible eliminar el empleado"); window.history.back();</script>`);
    } else {
      const usuario = await DataUsuarios.eliminarUsuario(filtro);

      if (empleado.empleado.path !== '../../static/img/empleadoP.jpg') {
        // Verificar si el producto tiene una imagen antes de intentar borrarla
        await fs.unlink(path.resolve(`frontend/static/fotos/${empleado.empleado.path}`));
      } else {
        console.log('El empleado no tiene una imagen para borrar.');
      }
      if (usuario.exito === false) {
        res.status(500).json({mensaje: 'No fue posible eliminar el usuario'});
      } else {
        log.registrologs(`${infoUsuario} Elimino el empleado: ${empleado.empleado.email}`);
        res.redirect('/v1/registroEmpleado');
      }
    }
  } catch (error) {
    res.redirect('/v1/error');
    console.log(error);
  }
};
