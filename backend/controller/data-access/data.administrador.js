const Administrador = require('../../models/administrador.model');

exports.agregarAdministrador = async (agragarCliente) => {
  try {
    const administrador = await new Administrador(agragarCliente).save();
    if (administrador) {
      return {exito: true, administrador};
    } else {
      return {exito: false, error: 'No fue posible guardar el Cliente'};
    }
  } catch (error) {
    console.error('Error al registrar administrador:', error);
    return {exito: false, error};
  }
};


exports.buscarAdministrador = async (filtro, opciones) => {
  try {
    const administrador = await Administrador.find(filtro, opciones);

    if (administrador.length > 0) {
      return {exito: true, administrador};
    } else {
      return {exito: false, error: 'No se encontraron administrador registrados'};
    }
  } catch (error) {
    console.error('Error al buscar administrador:', error);
    return {exito: false, error: 'Error al buscar administrador'};
  }
};


exports.eliminarA = async (id) => {
  try {
    const eliminar = await Administrador.findByIdAndDelete(id);

    if (!eliminar) {
      return ('Error en el servidor de administrador');
    } else {
      return eliminar;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.actualizarA = async (id, actualizarDatos) => {
  try {
    const actualizar = await Administrador.findByIdAndUpdate(id, actualizarDatos);
    return actualizar;
  } catch (error) {
    console.log(error);
    throw error;
  }
};