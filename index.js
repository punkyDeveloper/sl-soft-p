const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./openapi3_0.json');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const PORT = process.env.PORT || 3000;
const router = require('./backend/routes/ruta');
const multer = require('multer');
const {v4: uuidv4} = require('uuid');
const {format} = require('timeago.js');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// middlewers
const tiposDeImagen = ['image/png', 'image/jpeg', 'image/jpg'];

const storage = multer.diskStorage({
  destination: path.join(__dirname, './frontend/static/fotos'),
  filename: (req, file, cb, res) => {
    // le colocamos nombre randon a la imagen
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // si los de imagen imcluido dentro de las extensiones permitidas es valida 
  if (tiposDeImagen.includes(file.mimetype)){
   cb(null, true);
  }else {
    // devuelve error si la extension no es valida
    cb(new Error('extension no valida'));
  }
}  

const upload = multer({ storage, fileFilter }).single('image');

// Manejo de errores
app.use((req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // error de multer
      res.status(400).json({error: err.message});
    } else if (err) {
      // error de tipo de archivo
      res.status(500).send('<script>alert( "error '+ err.message +'"); window.history.back(); </script>');
      
    } else {
      // todo salio bien
      next();
    }
  })
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/frontend/views/pages'));

app.use(morgan('dev'));
app.use(express.json());

app.use(cookieParser());
// es como que esta bien la peticion y hace no se envie basio lo de la base de datos
app.use(express.urlencoded({extended: true}));

app.use('/static', express.static('./frontend/static'));

// rutas
app.use('/', router);

// puesto
app.listen(PORT, () => {
  console.log(`Conectado en el puerto ${PORT}`);
});
