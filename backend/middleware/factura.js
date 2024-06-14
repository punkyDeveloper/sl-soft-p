/* eslint-disable linebreak-style */
const PDF = require('pdfkit-construct');
const fs = require('fs');

exports.descargarFactura = async (nombreDocumento, stream, clienteDatos, productosDatos, metodoPagoDato, envioDatos, subtotalDatos, totalPagoDato, fechaString) => {
  const fecha = new Date(fechaString);
  const opcionesDeFormato = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesDeFormato);


  const doc = new PDF({bufferPage: true});

  doc.on('data', (data) => {
    stream.write(data);
  });
  doc.on('end', () => {
    stream.end();
  });
  clienteDatos.forEach((cliente) => {
    doc.setDocumentHeader({height: '25%'}, () => {
      doc.fontSize(15).text('Factura de venta', {
        align: 'center',
        margins: {top: 20, left: 10, right: 10, bottom: 20},
      });
      doc.fontSize(10);

      doc.text('', {
        width: 420,
        align: 'left',
      });
      doc.text(`Nombre:  ${cliente.nombre} ${cliente.apellido}`, {
        width: 420,
        align: 'left',
      });

      doc.text(`Email:  ${cliente.email}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Celular:  ${cliente.celular}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Documento:  ${cliente.documento}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Direccion:  ${cliente.direccion}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Metodo de pago:  ${metodoPagoDato}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Fecha:  ${fechaFormateada}`, {
        width: 420,
        align: 'left',
      });
    });
  });


  doc.addTable([
    {key: 'nombre', label: 'Productos Comprados', align: 'left'},
    {key: 'talla', label: 'Talla', align: 'left'},
    {key: 'cantidad', label: 'Cantidad', align: 'left'},
    {key: 'precio', label: 'Precio', align: 'left'},
  ], productosDatos.map((producto) => ({
    nombre: producto.nombre,
    talla: producto.talla,
    cantidad: producto.cantidad,
    precio: producto.precio.toLocaleString(),
  })),
  {
    width: 'fill_body',
    striped: true,
    cellsPadding: 10,
    stripedColors: ['#f6f6f6', '#DFDFDF'],
    marginLeft: 45,
    marginRight: 45,
    headAlign: 'center',
  });

  doc.addTable([
    {key: 'envio', label: 'Envio', align: 'left'},
    {key: 'descuento', label: 'Descuento', align: 'left'},
    {key: 'subTotal', label: 'Subtotal', align: 'left'},
    {key: 'total', label: 'Total', align: 'left'},
  ], [
    {
      envio: envioDatos,
      descuento: '0%',
      subTotal: subtotalDatos,
      total: totalPagoDato,
    },
  ], {
    width: 'fill_body',
    striped: true,
    cellsPadding: 10,
    stripedColors: ['#f6f6f6', '#DFDFDF'],
    marginLeft: 45,
    marginRight: 45,
    headAlign: 'center',
  });

  doc.setDocumentFooter({height: '15%'}, () => {
    doc.image( 'frontend/static/img/logo/logo.png', doc.footer.x + 160, doc.footer.y);
  });

  doc.render();
  doc.end();
};

exports.enviarFactura = async (rutaPDF, stream, clienteDatos, productosDatos, metodoPagoDato, envioDatos, subtotalDatos, totalPagoDato, fechaString) => {
  const fecha = new Date(fechaString);
  const opcionesDeFormato = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesDeFormato);


  const doc = new PDF({bufferPage: true});

  doc.on('data', (data) => {
    stream.write(data);
  });
  doc.on('end', () => {
    stream.end();
  });
  clienteDatos.forEach((cliente) => {
    doc.setDocumentHeader({height: '25%'}, () => {
      doc.fontSize(15).text('Factura de venta', {
        align: 'center',
        margins: {top: 20, left: 10, right: 10, bottom: 20},
      });
      doc.fontSize(10);

      doc.text('', {
        width: 420,
        align: 'left',
      });
      doc.text(`Nombre:  ${cliente.nombre} ${cliente.apellido}`, {
        width: 420,
        align: 'left',
      });

      doc.text(`Email:  ${cliente.email}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Celular:  ${cliente.celular}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Documento:  ${cliente.documento}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Direccion:  ${cliente.direccion}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Metodo de pago:  ${metodoPagoDato}`, {
        width: 420,
        align: 'left',
      });
      doc.text(`Fecha:  ${fechaFormateada}`, {
        width: 420,
        align: 'left',
      });
    });
  });


  doc.addTable([
    {key: 'nombre', label: 'Productos Comprados', align: 'left'},
    {key: 'talla', label: 'Talla', align: 'left'},
    {key: 'cantidad', label: 'Cantidad', align: 'left'},
    {key: 'precio', label: 'Precio', align: 'left'},
  ], productosDatos.map((producto) => ({
    nombre: producto.nombre,
    talla: producto.talla,
    cantidad: producto.cantidad,
    precio: producto.precio.toLocaleString(),
  })),
  {
    width: 'fill_body',
    striped: true,
    cellsPadding: 10,
    stripedColors: ['#f6f6f6', '#DFDFDF'],
    marginLeft: 45,
    marginRight: 45,
    headAlign: 'center',
  });

  doc.addTable([
    {key: 'envio', label: 'Envio', align: 'left'},
    {key: 'descuento', label: 'Descuento', align: 'left'},
    {key: 'subTotal', label: 'Subtotal', align: 'left'},
    {key: 'total', label: 'Total', align: 'left'},
  ], [
    {
      envio: envioDatos,
      descuento: '0%',
      subTotal: subtotalDatos,
      total: totalPagoDato,
    },
  ], {
    width: 'fill_body',
    striped: true,
    cellsPadding: 10,
    stripedColors: ['#f6f6f6', '#DFDFDF'],
    marginLeft: 45,
    marginRight: 45,
    headAlign: 'center',
  });

  doc.setDocumentFooter({height: '15%'}, () => {
    doc.image( 'frontend/static/img/logo/logo.png', doc.footer.x + 160, doc.footer.y);
  });

  doc.render();
  doc.pipe(fs.createWriteStream(rutaPDF));
  doc.end();
};
