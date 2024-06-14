const mongoose = require('../config/config');
const SchemaVenta = new mongoose.Schema({
  cliente: [{
    type: Object,
    required: [true, 'Se requiere la informacion del usiario'],
  }],
  productos: [{
    type: Object,
    required: [true, 'Se requiere almenos un producto'],
    minlength: 1,
  }],
  envio: {
    type: Number,
    default: 25000,
  },
  subtotal: {
    type: Number,
    required: [true, 'Se debe especificar el dubtotal de la compra'],
  },
  totalPago: {
    type: Number,
    required: [true, 'Se debe especificar el total de la compra'],
  },
  metodoPago: {
    type: String,
    required: [true, 'Se debe especificar un metodo de pago'],
  },
}, {timestamps: true} );

const nuevaVenta = mongoose.model('ventas', SchemaVenta);
module.exports =nuevaVenta;
