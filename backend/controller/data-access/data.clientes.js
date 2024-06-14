const Clientes = require('../../models/clientes.models');

exports.agregarC = async (datos) => {
  try {
    const cliente = await new Clientes(datos).save();
    if (cliente) {
      return {exito: true, cliente};
    } else {
      return {exito: false, error: 'No fue posible guardar el Cliente'};
    }
  } catch (error) {
    console.error('Error al registrar Cliente:', error);
    return {exito: false, error};
  }
};

exports.buscarClientes = async (filtro, opciones) => {
  try {
    const clientes = await Clientes.find(filtro, opciones);
    if (clientes.length > 0) {
      return {exito: true, clientes};
    } else {
      return {exito: false, error: 'No se encontraron cliente registrados'};
    }
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    return {exito: false, error: 'Error al buscar cliente'};
  }
};


exports.buscarClientesLista = async (filtro, opciones) => {
  try {
    const clientes = await Clientes.find();
    if (clientes.length > 0) {
      return {exito: true, clientes};
    } else {
      return {exito: false, error: 'No se encontraron cliente registrados'};
    }
  } catch (error) {
    console.error('Error al buscar cliente:', error);
    return {exito: false, error: 'Error al buscar cliente'};
  }
};

exports.eliminarC = async (id) => {
  try {
    const eliminar = await Clientes.findByIdAndDelete(id);
    if (eliminar) {
      return {exito: true, cliente: eliminar};
    } else {
      return {exito: false, error: 'No se encontro el cliente para eliminar'};
    }
  } catch (error) {
    console.error('Error al actualizar Cliente:', error);
    return {exito: false, error};
  }
};


exports.actualizarC = async (id, actualizarDatos) => {
  try {
    const actualizar = await Clientes.findByIdAndUpdate(id, actualizarDatos);
    if (actualizar) {
      return {exito: true, Cliente: actualizar};
    } else {
      return {exito: false, error: 'No se encontró el Cliente para actualizar'};
    }
  } catch (error) {
    console.error('Error al actualizar Cliente:', error);
    return {exito: false, error};
  }
};
