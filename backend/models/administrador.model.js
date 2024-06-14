const mongoose = require('../config/config');

const SchemaAdministradore = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Se requiere un nombre del empleado.'],
    minlength: 2,
    maxlength: 80,
  },
  apellido: {
    type: String,
    required: [true, 'Se requiere un apellido del empleado'],
    minlength: 2,
    maxlength: 80,
  },
  documento: {
    type: String,
    required: [true, 'Se requiere un documento del empleado'],
    unique: true,
    minlength: 7,
  },
  email: {
    type: String,
    required: [true, 'Se requiere un email'],
    unique: true,
  },

  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'usuarios.model',
  },
}, {
  timestamps: true,
});

const nuevoadministradore = mongoose.model('administradores', SchemaAdministradore);

module.exports = nuevoadministradore;
