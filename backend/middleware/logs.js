const fs = require('fs');
const path = require('path');

exports.registrologs = (mensaje) => {
    const fecha = new Date().toISOString();
    const informacion = `${fecha}: ${mensaje}\n`;
    const nombreLogs= path.join(__dirname, '../files/logs','listaLogs.txt');
  
    fs.appendFile(nombreLogs, informacion, (err) => {
      if (err) {
        console.error('Error al escribir en el archivo de log:', err);
      }
    });
  }