const datoCliente = require('../data-access/data.clientes');
const datoEmpleado = require('../data-access/data.empleados');
const datoAdministrador= require('../data-access/data.administrador');
const servicioCorreo = require('../../middleware/correo');
const log = require('../../middleware/logs');

exports.index1 = async (req, res)=>{
  try {
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;
    if (misDatosCookie === undefined) {
      res.render('index', {rol: rol || null, misDatos: null});
    } else {
      const idCliente = JSON.parse(misDatosCookie).map((dato) => dato._id);
      const infoCliente = await datoCliente.buscarClientes({_id: idCliente});
      res.render('index', {rol: rol || null, misDatos: infoCliente.clientes});
    }
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};


exports.resgistrousuario = (req, res)=>{
  res.render('registroCliente');
};

exports.inicioSecion = (req, res)=>{
  res.render('inicio');
};

exports.fromularioAdministrador = async (req, res)=>{
  try {
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;
    if (misDatosCookie === undefined) {
      res.render('formularioAdministrador', {rol: rol || null, misDatos: null});
    } else {
      const idCliente = JSON.parse(misDatosCookie).map((dato) => dato._id);
      const infoCliente = await datoAdministrador.buscarAdministrador({_id: idCliente});
      res.render('formularioAdministrador', {rol: rol || null, misDatos: infoCliente.clientes});
    }
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};


exports.opinionClinete = async (req, res) => {
  try {
    const correoCliente = req.body.email;
    const opinion = req.body.mensaje;
    const mensaje = `
    Correo del clinete: ${correoCliente}
    Mensaje:
    ${opinion}
    `;
    const mensajeCliente = `
    
      ¡Estimado Cliente!,
      Queremos expresar nuestro sincero agradecimiento por tomarte el tiempo para compartir tu opinión con nosotros. Valoramos enormemente tu aporte, ya que nos ayuda a mejorar y ofrecer un servicio aún mejor.
  
      Cada comentario que recibimos es fundamental para nuestro equipo, y tu contribución nos impulsa a trabajar constantemente en la dirección correcta. Apreciamos tu confianza en [Nombre de la Empresa] y estamos comprometidos a seguir superando tus expectativas.
  
      Gracias nuevamente por tu valiosa opinión. Estamos aquí para ti y esperamos continuar sirviéndote de la mejor manera posible.
  
      Atentamente,
  
      SL-SOFT
    `;
    await servicioCorreo.sendEmail(process.env.CORREO_INFO, 'Opinion del cliente', mensaje);
    await servicioCorreo.sendEmail(correoCliente, 'Confirmacion', mensajeCliente);

    res.redirect('/v1/sl-ropa');
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};

exports.errorPassword = async (req, res) => {
  try {
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;
    if (rol === undefined) {
      res.render('errorPassword', {rol: null, misDatos: null});
    } else if (rol === 'cliente') {
      const idCliente = JSON.parse(misDatosCookie).map((dato) => dato._id);
      const infoCliente = await datoCliente.buscarClientes({_id: idCliente});
      res.render('errorPassword', {rol: rol || null, misDatos: infoCliente.clientes});
    } else if (rol === 'empleado') {
      const idEmpleado = JSON.parse(misDatosCookie).map((dato) => dato._id);
      const infoEmpleado = await datoEmpleado.buscarEmpleados({_id: idEmpleado});
      res.render('errorPassword', {rol: rol || null, misDatos: infoEmpleado.empleados});
    } else if (rol === 'administrador') {
      const idAdministrador = JSON.parse(misDatosCookie).map((dato) => dato._id);
      const infoAdministrador = await datoAdministrador.buscarAdministrador({_id: idAdministrador});
      res.render('errorPassword', {rol: rol || null, misDatos: infoAdministrador.administrador});
    };
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};

exports.error = async (req, res) => {
  const rol = req.cookies.rol;
  console.log(rol);
  const misDatosCookie = req.cookies.misDatos;
  if (rol === undefined) {
    res.render('error', {rol: null, misDatos: null});
  } else if (rol === 'cliente') {
    const idCliente = JSON.parse(misDatosCookie).map((dato) => dato._id);
    const infoCliente = await datoCliente.buscarClientes({_id: idCliente});
    res.render('error', {rol: rol || null, misDatos: infoCliente.clientes});
  } else if (rol === 'empleado') {
    const idEmpleado = JSON.parse(misDatosCookie).map((dato) => dato._id);
    const infoEmpleado = await datoEmpleado.buscarEmpleados({_id: idEmpleado});
    res.render('error', {rol: rol || null, misDatos: infoEmpleado.empleados});
  } else if (rol === 'administrador') {
    const idAdministrador = JSON.parse(misDatosCookie).map((dato) => dato._id);
    const infoAdministrador = await datoAdministrador.buscarAdministrador({_id: idAdministrador});
    res.render('error', {rol: rol || null, misDatos: infoAdministrador.administrador});
  };
};
