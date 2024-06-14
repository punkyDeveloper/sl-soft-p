const Usuario = require('../../models/usuarios.model');
// const bcrypt = require('bcrypt');


exports.agregarUsuario = async (agregarU) => {
  try {
    const nuevoUsuario = new Usuario(agregarU);
    const nuevoUsuario1 = await nuevoUsuario.save();
    return nuevoUsuario1;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.buscarUsuario = async (filtro, data) => {
  try {
    const usuario = await Usuario.find(filtro, data);

    if (usuario.length > 0) {
      return {exito: true, usuarios};
    } else {
      return {exito: false, error: 'No se encontraron cliente registrados'};
    }
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    return {exito: false, error: 'Error al buscar cliente'};
  }
};

exports.eliminarUsuario = async (id) => {
  try {
    const eliminar = await Usuario.findByIdAndDelete(id);
    if (eliminar) {
      return {exito: true};
    } else {
      return {exito: false};
    }
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return {exito: false, error};
  }
};
exports.eliminarProducto = async (filtro) => {
  try {
    const producto = await Productos.findByIdAndDelete(filtro);
    if (producto) {
      return {exito: true};
    } else {
      return {exito: false};
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return {exito: false, error};
  }
};


exports.actualizarUsuario = async (id, datos) => {
  try {
    const datosActualizado = await Usuario.findByIdAndUpdate(id, datos);
    if (datosActualizado) {
      return {exito: true, datosActualizado};
    }else {
      return {exito: false, error: 'Error al actualizar los datos del usuario'}
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.actualizadoDato = async (filtro,dato) => {
  try {
    const datoUsuario = await Usuario.updateOne(filtro, dato);
    if (datoUsuario) {
      return {exito: true, datoUsuario};
    } else {
      return {exito: false, error: 'No se pudo actualizar el dato del usuario.'};
    }
  } catch (error) {
    console.error('Error al actualizar el dato del producto:', error);
    return {exito: false, error};
  }
}

// busqueda del login
exports.buscarUsuarioLogin = async (filtro, data) => {
  try {
    const usuarios = await Usuario.findOne(filtro, data);

    if (usuarios) {
      return usuarios;
    } else {
      return {exito: false};
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// busqueda de recuperar contraseña id

exports.busquedaId = async (filtro, data) => {
  try {
    const buscar = await Usuario.findById(filtro, data);

    if (buscar) {
      return buscar;
    } else {
      return ('error en el servidor de buscar id del usuario');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.actualizarContraseña = async (filtro, data) => {
  try {
    const actualizar = await Usuario.findByIdAndUpdate(filtro, data);

    if (actualizar) {
      return actualizar;
    } else {
      return ('error en el servidor de actualizar contraseña');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
