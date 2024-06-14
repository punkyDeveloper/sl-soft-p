const Empleados = require('../../models/empleados.model');


exports.buscarEmpleados = async (filtro, opciones) => {
  try {
    const empleados = await Empleados.find(filtro, opciones);
    if (empleados.length > 0) {
      return {exito: true, empleados};
    } else {
      return {exito: false, error: 'No se encontraron empleados registrados'};
    }
  } catch (error) {
    console.error('Error al buscar empleados:', error);
    return {exito: false, error};
  }
};

exports.registrarEmpleados = async (datos) => {
  try {
    const empleado = await new Empleados(datos).save();
    if (empleado) {
      return {exito: true, empleado};
    } else {
      return {exito: false, error: 'No fue posible guardar el empleado'};
    }
  } catch (error) {
    console.error('Error al registrar empleado:', error);
    return {exito: false, error};
  }
};

exports.eliminarEmpleados = async (id) => {
  try {
    const empleado = await Empleados.findByIdAndDelete(id);
    if (empleado) {
      return {exito: true, empleado: empleado};
    } else {
      return {exito: false, error: 'Empleado no encontrado'};
    }
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    return {exito: false, error};
  }
};

exports.actualizarEmpleados = async (id, datos) => {
  try {
    const empleado = await Empleados.findByIdAndUpdate(id, datos);
    if (empleado) {
      return {exito: true, dato: empleado};
    } else {
      return {exito: false, error: 'Empleado no encontrado'};
    }
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    return {exito: false, error};
  }
};

exports.verEmpleadoById = async (filtro) => {
  try {
    const EmpleadoById = await Empleados.findByIdAndUpdate(filtro);
    if (EmpleadoById) {
      return {
        respuesta: true,
        Empleado: EmpleadoById,
      };
    } else {
      return {
        respuesta: false,
        mensaje: 'No se pudo encontrar el Empleado',
      };
    }
  } catch (err) {
    return err;
  }
};
