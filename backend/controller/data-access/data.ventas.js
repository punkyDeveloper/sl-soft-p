const Ventas = require('../../models/ventas.model');

exports.buscarVenta = async (filtro, opciones) => {
  try {
    const ventas = await Ventas.find(filtro, opciones);
    if (ventas.length > 0) {
      return {exito: true, dato: ventas};
    } else {
      return {exito: false, error: 'No se encontro ningun venta'};
    }
  } catch (error) {
    console.error('Error al buscar ventas:', error);
    return {exito: false, error: 'Error al buscar ventas'};
  }
};

exports.guardaVenta = async (datos) => {
  try {
    const venta = await new Ventas(datos).save();
    if (venta) {
      return venta;
    } else {
      return {exito: false, error: 'No fue posible guardar el venta'};
    }
  } catch (error) {
    console.error('Error al registrar venta:', error);
    return {exito: false, error: 'Error al registrar venta'};
  }
};

exports.eliminarVenta = async (id) => {
  try {
    const venta = await Ventas.findByIdAndDelete(id);
    if (venta) {
      return {exito: true, message: 'venta eliminado correctamente'};
    } else {
      return {exito: false, error: 'No fue posible eliminar el venta'};
    }
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    return {exito: false, error: 'Error al eliminar venta'};
  }
};

exports.actualizarVenta = async (id, datos) => {
  try {
    const venta = await Ventas.findOneAndUpdate(id, datos);
    if (venta) {
      return {exito: true, dato: venta};
    } else {
      return {exito: false, error: 'No fue posible actualizar el venta'};
    }
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    return {exito: false, error: 'Error al actualizar venta'};
  }
};
