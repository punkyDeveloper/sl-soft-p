
const Stripe = require('stripe');
const stripe = new Stripe(process.env.LLAVE);
const DataVentas = require('../data-access/data.ventas');
const DataProductos = require('../data-access/data.productos');
const DataCliente = require('../data-access/data.clientes');
const factura = require('../../middleware/factura');
const servicioCorreo = require('../../middleware/correo');
const fs = require('fs');
const log = require('../../middleware/logs');

exports.listarVenta = async (req, res) => {
  try {
    const ventas = await DataVentas.buscarVenta();
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;

    if (misDatosCookie === undefined) {
      res.render('listaVentas', {
        venta: ventas.dato,
        datos: ventas.exito,
        rol: rol || null,
        misDatos: null,
      });
    } else {
      res.render('listaVentas', {
        venta: ventas.dato,
        datos: ventas.exito,
        rol: rol,
        misDatos: JSON.parse(misDatosCookie),
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};

exports.compra = async (req, res) => {
  try {
    const listaProductos = await DataProductos.buscarProducto();
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;

    if (misDatosCookie === undefined) {
      res.render('compra', {
        productos: listaProductos.productos,
        datos: listaProductos.exito,
        rol: rol || null,
        misDatos: null,
      });
    } else {
      res.render('compra', {
        productos: listaProductos.productos,
        datos: listaProductos.exito,
        rol: rol,
        misDatos: JSON.parse(misDatosCookie),
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};

exports.guardaVenta = async (req, res) => {
  try {
    const idCliente = JSON.parse(req.cookies.misDatos).map((dato) => dato._id);
    const infoCliente = await DataCliente.buscarClientes({_id: idCliente});
    const productos = req.body.carrito;
    const datosVenta = {
      cliente: infoCliente.clientes,
      productos: productos,
      subtotal: req.body.subtotal,
      totalPago: parseInt(req.body.total),
      metodoPago: req.body.metodoPago,
    };

    await DataVentas.guardaVenta(datosVenta);
    for (const dato of productos) {
      let idProductoVenta = dato.id;
      let cantidadVenta = dato.cantidad;
      let cantidadActual;
      let cantidadProducto = await DataProductos.buscarProducto({ _id: idProductoVenta });
      cantidadProducto.productos.map((dato) =>{
        cantidadActual = dato.cantidad 
      });
      let nuavaCantudad = cantidadActual - cantidadVenta
      const datoNuevo= {
        cantidad: nuavaCantudad,
      }
      await DataProductos.actualizarDato({_id: idProductoVenta}, datoNuevo)
    }

    let correoDato;
    let nombreCompleto;

    infoCliente.clientes.forEach((cliente) => {
      const correo = cliente.email;
      const nombre = cliente.nombre;
      const apellido = cliente.apellido;
      correoDato = correo;
      nombreCompleto= nombre + ' ' + apellido;
    });

    const clienteDatos = infoCliente.clientes;
    const productosDatos = productos;
    const metodoPagoDato = req.body.metodoPago;
    const envioDatos = 25000;
    const subtotalDatos = parseInt(req.body.subtotal);
    const totalPagoDato = parseInt(req.body.total);
    const fechaString = new Date();

    const nombreDocumento = `factura${Date.now()}.pdf`;
    const rutaPDF = `backend/files/${nombreDocumento}`;
    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-disposition': `attachment; filename=${nombreDocumento}`,
    });

    await factura.enviarFactura(rutaPDF, stream, clienteDatos, productosDatos, metodoPagoDato, envioDatos, subtotalDatos, totalPagoDato, fechaString);

    const mensajeCliente = `
    ¡Hola ${nombreCompleto}!.
    
    Queríamos expresar nuestro más sincero agradecimiento por elegirnos. Tu confianza en nosotros significa el mundo. Estamos aquí para brindarte la mejor experiencia posible. ¡Gracias por ser parte de nuestra familia!.
    
    Atentamente,
    SL-SOFT`;
    const mensajeEnpleado = `
    ¡Hola!
    Te informamos con entusiasmo que hemos recibido tu nuevo pedido. Aquí están los detalles:
    `;
    await servicioCorreo.correDocumento(correoDato, 'Factura de compra en SL-SOFT', mensajeCliente, nombreDocumento, rutaPDF);
    await servicioCorreo.correDocumento(process.env.CORREO_INFO, 'Nuevo pedido', mensajeEnpleado, nombreDocumento, rutaPDF);
    fs.unlink(rutaPDF, (unlinkError) => {
      if (unlinkError) {
        console.error('Error al eliminar el archivo PDF:', unlinkError);
      } else {
        console.log('Archivo PDF eliminado con éxito');
      }
    });
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};

exports.pasarelaPago = async (req, res) => {
  const isLocal = process.env.NODE_ENV; 

  let successUrl;
  if (isLocal === 'development'){
    successUrl = 'http://localhost:6700/v1/confirmacionVenta'
  } else {
    successUrl = 'https://sl-ropa.onrender.com/v1/confirmacionVenta';
  }
  
  let cancelUrl;
  if (isLocal === 'development'){
    cancelUrl = 'http://localhost:6700/v1/compra'
  } else {
    cancelUrl = 'https://sl-ropa.onrender.com/v1/compra'
  }
  
  try {
    const total = req.body.total * 100;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            product_data: {
              name: 'Productos de SL-soft',
            },
            currency: 'cop',
            unit_amount: total,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  
    res.redirect(`${session.url}`);
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};

exports.descargarFactura = async (req, res) => {
  try {
    const datosVenta = await DataVentas.buscarVenta({_id: req.params.id});

    if (datosVenta.exito === false) {
      res.send('<script>alert("Los datos de la factura no fueron encontrados."); window.history.back();</script>');
    } else {
      let clienteDatos;
      let productosDatos;
      let metodoPagoDato;
      let envioDatos;
      let subtotalDatos;
      let totalPagoDato;
      let fechaString;

      datosVenta.dato.forEach((venta) => {
        // Acceder a los datos específicos de cada venta
        const envio = venta.envio;
        const totalPago = venta.totalPago;
        const metodoPago = venta.metodoPago;
        const cliente = venta.cliente;
        const productos = venta.productos;
        const fecha = venta.createdAt;
        const subtotal = venta.subtotal;

        envioDatos = envio.toLocaleString();
        totalPagoDato = totalPago.toLocaleString();
        subtotalDatos = subtotal.toLocaleString();
        metodoPagoDato = metodoPago;
        clienteDatos= cliente;
        productosDatos = productos;
        fechaString = fecha;
      });
      const nombreDocumento= `factura${Date.now()}.pdf`;
      const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment; filename=${nombreDocumento}`,
      });
      await factura.descargarFactura(nombreDocumento, stream, clienteDatos, productosDatos, metodoPagoDato, envioDatos, subtotalDatos, totalPagoDato, fechaString);
    };
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};

exports.confirmacionVenta = async (req, res) => {
  try {
    const rol = req.cookies.rol;
    const misDatosCookie = req.cookies.misDatos;
    const idCliente = JSON.parse(misDatosCookie).map((dato) => dato._id);
    const infoCliente = await DataCliente.buscarClientes({_id: idCliente});
    if (misDatosCookie === undefined) {
      res.render('ConfirmacionPago', {rol: rol || null, misDatos: null});
      return;
    } else {
      res.render('ConfirmacionPago', {rol: rol || null, misDatos: infoCliente.clientes});
    }
    res.render('ConfirmacionPago');
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  };
};

exports.buscarVenta = async (req, res) => {
  try {
    const ventas = await DataVentas.buscarVenta();
    if (ventas.exito) {
      res.status(200).json({resutados: ventas});
    } else {
      res.status(500).json({mensaje: 'No se encontro ninguna venta registrada'});
    }
  } catch (error) {
    console.log(error);
    res.redirect('/v1/error');
  }
};
