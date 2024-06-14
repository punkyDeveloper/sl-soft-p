const Data = require('../data-access/data.productos');
const datosCliente = require('../data-access/data.clientes');
const datosEmpleado = require('../data-access/data.empleados')
const datosAdministrador = require('../data-access/data.administrador')
const modeloProductos = require('../../models/productos.model');
const fs = require('fs').promises;
const path = require('path');
const {unlink} = require('fs-extra');
const log = require('../../middleware/logs');

exports.catalogo = async (req, res) => {
  try {
    const listaProductos= await Data.buscarProducto();
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;

    if (misDatosCookie === undefined) {
      res.render('catalogo', {
        productos: listaProductos.productos,
        datos: listaProductos.exito,
        rol: null,
        misDatos: null,
      });
    } else {
      const idCliente = JSON.parse(misDatosCookie).map((dato) => dato._id);
      const infoCliente = await datosCliente.buscarClientes({_id: idCliente});
      res.render('catalogo', {
        productos: listaProductos.productos,
        datos: listaProductos.exito,
        misDatos: infoCliente.clientes,
        rol: rol,

      });
    }
  } catch (error) {
    res.redirect('/v1/error');
    console.log(error);
  }
};


exports.formularioProducto = async (req, res) => {
  try {
    const productos = await Data.buscarProducto();
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;

    if (misDatosCookie === undefined) {
      res.render('formularioProducto', {
        productos: productos.productos,
        datos: productos.exito,
        rol: rol || null,
        misDatos: null,
      });
    } else {
      res.render('formularioProducto', {
        productos: productos.productos,
        datos: productos.exito,
        rol: rol,
        misDatos: JSON.parse(misDatosCookie),
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};

exports.listarProductos = async (req, res) => {
  try {
    const productos = await Data.buscarProducto();
    if (productos.exito === false) {
      res.status(500).json({mensaje: 'No se encontro ningun producto'});
    } else {
      res.status(200).json(productos);
    }
  } catch (error) {
    res.redirect('/v1/error');
    console.log(error);
  }
};


exports.eliminarProducto = async (req, res) => {
  try {
    const {id} = req.params;
    const producto = await modeloProductos.findByIdAndDelete(id);
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;
    const idUsuario = JSON.parse(misDatosCookie).map((dato) => dato._id);
    let infoUsuario;
    if (rol === 'empleado') {
      const info = await datosEmpleado.buscarEmpleados({ _id: idUsuario });
      if (info.empleados.length > 0) {
        
        infoUsuario = info.empleados[0].email;
      } else {
        
        console.error('Empleado no encontrado');
      }
    } else if (rol === 'administrador') {
      const info = await datosAdministrador.buscarAdministrador({ _id: idUsuario });
      if (info.administrador.length > 0) {
        
        infoUsuario = info.administrador[0].email;
      } else {
      
        console.error('Administrador no encontrado');
      }
    }

    if (producto.path !== '../../static/img/producto.jpg') {
      // Verificar si el producto tiene una imagen antes de intentar borrarla
      await fs.unlink(path.resolve(`frontend/static/fotos/${producto.path}`));
    } else {
      console.log('No hay imagen por eliminar')
    }

    log.registrologs(`${infoUsuario} Elimino el producto: Nombre: ${producto.nombre} Referencia: ${producto.referencia}`)
    res.redirect('/v1/registroProducto');
  } catch (error) {
    console.error('Error al borrar la imagen o el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
};

exports.actualizarProductos = async (req, res) => {
  try {
    const filtro = {_id: req.body.idnuevo};
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;
    const idUsuario = JSON.parse(misDatosCookie).map((dato) => dato._id);
    let infoUsuario;
    if (rol === 'empleado') {
      const info = await datosEmpleado.buscarEmpleados({ _id: idUsuario });
      if (info.empleados.length > 0) {
        
        infoUsuario = info.empleados[0].email;
      } else {
        
        console.error('Empleado no encontrado');
      }
    } else if (rol === 'administrador') {
      const info = await datosAdministrador.buscarAdministrador({ _id: idUsuario });
      if (info.administrador.length > 0) {
        
        infoUsuario = info.administrador[0].email;
      } else {
      
        console.error('Administrador no encontrado');
      }
    }
    const datos = {
      nombre: req.body.nombre,
      talla: req.body.talla,
      referencia: req.body.referencia,
      precio: req.body.precio,
      descripcion: req.body.descripcion,
      cantidad: req.body.cantidad,
      categoria: req.body.categoria,
      path: req.body.image,
    };

    
    if (req.file) {
      const nuevaRutaImagen = '../../static/fotos/' + req.file.filename;

      // Verifica si ya existe una ruta de imagen y si es así, la deja intacta

      if (req.body.rutaImagenVieja && req.body.rutaImagenVieja !== nuevaRutaImagen ) {
        if (req.body.rutaImagenVieja === '../../static/img/producto.jpg'){
          console.log('No hay imagen registrada para eliminar')
        }else {
          // Elimina la imagen antigua
          await unlink(path.resolve(`frontend/static/fotos/${req.body.rutaImagenVieja}`));
        }
      } else {
        console.log('No hay imagen registrada para eliminar')
      }

      datos.path = nuevaRutaImagen;
    }

    const producto = await Data.actualizarProducto(filtro, datos);
    if (producto.exito === false) {
      res.status(500).json({ mensaje: 'No fue posible actualizar el producto' });
    } else {

      log.registrologs(`${infoUsuario} Actualizo el producto: Nombre: ${producto.dato.nombre} Referencia: ${producto.dato.referencia}`);
      res.redirect('registroProducto');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};


exports.guardaProducto = async (req, res) => {
  try {
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;
    const idUsuario = JSON.parse(misDatosCookie).map((dato) => dato._id);
    let infoUsuario;
    if (rol === 'empleado') {
      const info = await datosEmpleado.buscarEmpleados({ _id: idUsuario });
      if (info.empleados.length > 0) {
        
        infoUsuario = info.empleados[0].email;
      } else {
        
        console.error('Empleado no encontrado');
      }
    } else if (rol === 'administrador') {
      const info = await datosAdministrador.buscarAdministrador({ _id: idUsuario });
      if (info.administrador.length > 0) {
        
        infoUsuario = info.administrador[0].email;
      } else {
      
        console.error('Administrador no encontrado');
      }
    }
    const datos = {
      nombre: req.body.nombre,
      talla: req.body.talla,
      referencia: req.body.referencia,
      precio: req.body.precio,
      descripcion: req.body.descripcion,
      cantidad: req.body.cantidad,
      categoria: req.body.categoria,
    };

    if (req.file) {
      datos.path = '../../static/fotos/' + req.file.filename;
    }

    const nuevoProducto = await Data.guardaProducto(datos);
    if (!nuevoProducto) {
      res.status(500).json({ mensaje: 'No se pudo guardar el producto capa 1' });
    }
    log.registrologs(`${infoUsuario} Registro el producto: Nombre: ${nuevoProducto.productos.nombre} Referencia: ${nuevoProducto.productos.referencia}`)
    res.redirect('registroProducto');
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};
