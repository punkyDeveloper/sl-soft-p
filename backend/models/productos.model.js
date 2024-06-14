const mongoose = require('../config/config');
const SchemnaProductos = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Se requiere un nombre del producto'],
    max: 30,
    min: 1,
  },
  talla: [{
    type: Object,
    required: [true, 'Se requiere una talla del producto'],
    minlength: 1,
  }],
  referencia: {
    type: String,
    requiere: [true, 'Se requiere una Referencia del producto'],
    min: 2,
  },
  cantidad: {
    type: Number,
    required: [true, 'Se requiere espesificar la cantidad de productos'],
  },
  precio: {
    type: Number,
    requiere: [true, 'Se requiere espesificar el precio del producto'],
  },
  descripcion: {
    type: String,
    requiere: [true, 'Se requiere una descripcion del producto'],
    min: 10,
    max: 100,
  },
  categoria: {
    type: String,
    requiere: [true, 'Se requiere una referencia del producto'],
  },
  filename: {
    type: String,
  },
  path: {
    type: String,
    default: '../../static/img/producto.jpg',
  },

}
, {timestamps: true},
);

const nuevoProducto = mongoose.model('productos', SchemnaProductos);
module.exports = nuevoProducto;
