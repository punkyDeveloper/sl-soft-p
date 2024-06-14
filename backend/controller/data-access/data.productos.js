const Productos = require('../../models/productos.model');

exports.buscarProducto = async (filtro, opciones) => {
  try {
    const productos = await Productos.find(filtro, opciones);
    if (productos.length > 0) {
      return {exito: true, productos};
    } else {
      return {exito: false, error: 'No se encontro ningun empleado registrado'};
    }
  } catch (error) {
    console.error('Error al buscar los Productos:', error);
    return {exito: false, error};
  }
};

exports.guardaProducto = async (datos) => {
  try {
    const productos = await new Productos(datos).save();
    if (productos) {
      return {exito: true, productos};
    } else {
      return {exito: false, error: 'no se pudo registrar el productos'};
    }
  } catch (error) {
    console.error('Error al registrar Producto:', error);
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

exports.actualizarProducto = async (id, datos) => {
  try {
    const producto = await Productos.findByIdAndUpdate(id, datos);
    if (producto) {
      return {exito: true, dato: producto};
    } else {
      return {exito: false, error: 'producto no encontrado'};
    }
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return {exito: false, error: 'Error al actualizar producto'};
  }
};

exports.actualizarDato = async (filtro, dato) => {
  try {
    const datoProducto = await Productos.updateOne(filtro, dato);
    if (datoProducto) {
      return {exito: true, datoProducto};
    } else {
      return {exito: false, error: 'No se pudo actualizar el dato del producto.'};
    }
  } catch (error) {
    console.error('Error al actualizar el dato del producto:', error);
    return {exito: false, error};
  }
};