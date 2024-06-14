const mongoose = require('../config/config');

const SchemaUsuarios = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Se requiere un email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Se requiere una contraseña'],
    minlength: 8,
  },
  rol: {
    type: String,
    required: [true, 'Se requiere un rol'],
  },
}, {timestamps: true});

const nuevoUsuario = mongoose.model('Usuario', SchemaUsuarios);

module.exports = nuevoUsuario;
