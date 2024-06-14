const log = require('../../middleware/logs');

exports.borrarCookie = (req, res) => {
  const cookiesABorrar = ['rol', 'misDatos'];

  // Iterar sobre la lista y borrar cada cookie
  cookiesABorrar.forEach((cookie) => {
    res.clearCookie(cookie);
  });

  // Redirigir al usuario a la página de inicio después de borrar las cookies
  res.redirect('/v1/sl-ropa');
};
