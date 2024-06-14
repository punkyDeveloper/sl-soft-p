const productos = require('../controller/use-cases/use.productos');
const cliente = require('../controller/use-cases/use.cliente');
const usuario = require('../controller/use-cases/use.usuario');
const vistas = require('../controller/use-cases/use.visual');
const funcionesEmpleados= require('../controller/use-cases/use.empleados');
const funcionesVentas= require('../controller/use-cases/use.ventas');
const recuperarcontraseña = require('../controller/use-cases/recuperarContraseña');
// eslint-disable-next-line no-unused-vars
const cookie = require('../controller/use-cases/coockies');
const Administrador = require('../controller/use-cases/use.administrador');
const express = require('express');
// eslint-disable-next-line new-cap
const router =express.Router();

// vistas
router.get('/sl-ropa', vistas.index1);
router.get('/sl-inicio', vistas.inicioSecion);


router.get('/opinion', vistas.opinionClinete);
router.get('/errorPassword', vistas.errorPassword);
router.get('/error', vistas.error);


// productos
router.get('/sl-catalogo', productos.catalogo);
router.get('/registroProducto', productos.formularioProducto);
router.get('/listarProducto', productos.listarProductos);
router.post('/agregarProducto', productos.guardaProducto);
router.post('/actualizarProducto', productos.actualizarProductos);
router.get('/eliminarProducto/:id', productos.eliminarProducto);

// cliente
router.get('/sl-registro', cliente.formularioClientes);
router.get('/perfilCliente', cliente.perfilCliente);
router.get('/buscarCliente', cliente.buscarClientes);
router.get('/listadoClientes', cliente.listadoClientes);
router.get('/eliminarClientes/:id', cliente.eliminarCliente);
router.post('/agregarCliente', cliente.agregarClientes);
router.post('/actualizarClientes', cliente.actualizarClientes);

// borrar cookies
router.post('/borrarCookie', cliente.borrarCookie);

// Empleado
router.get('/registroEmpleado', funcionesEmpleados.formularioEmpleado);
router.get('/listarEmpleado', funcionesEmpleados.listarEmpleado);
router.get('/eliminarEmpleado/:id', funcionesEmpleados.eliminarEmpleado);
router.post('/registrarEmpleado', funcionesEmpleados.registrarEmpleado);
router.post('/actualizarEmpleado/:id', funcionesEmpleados.actualizarEmpleado);


// usuario
router.post('/login', usuario.login);


// ventas
router.get('/compra', funcionesVentas.compra);
router.get('/confirmacionVenta', funcionesVentas.confirmacionVenta);
router.get('/listaVentas', funcionesVentas.listarVenta);
router.get('/descargarFactura/:id', funcionesVentas.descargarFactura);
router.post('/guardarVenta', funcionesVentas.guardaVenta);
router.post('/realizarPago', funcionesVentas.pasarelaPago);


// recuperar contraseña
router.get('/recuperar', recuperarcontraseña.fromularioRecuperar);
router.post('/rcontrasena', recuperarcontraseña.rcontrasena);
router.get('/recuperar1/:id', recuperarcontraseña.nuevaContraseña);
router.post('/nuevaContrasena/:id', recuperarcontraseña.cambiarContraseña);

// Administrador
router.post('/fromularioAdmin', Administrador.agregarAdministrador);
router.get('/fromularioAdmin', vistas.fromularioAdministrador);

module.exports=router;


