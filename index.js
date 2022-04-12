var bodyParser = require('body-parser');
var express = require('express');
var AWS = require('aws-sdk');
var cors = require('cors');
var port = 9000;

var app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.listen(port);
console.log('Listening on port', port);

const aws_keys = require('./credsAWS');  // Variable que guarda las credenciales de acceso de AWS
var corsOptions = { origin: true, optionsSuccessStatus: 200 };

const s3 = new AWS.S3(aws_keys.cred); // Variable que guarda las credenciales de acceso de S3
const rek = new AWS.Rekognition(aws_keys.cred); // Variable que guarda las credenciales de acceso de Rekognition

// ------------------------- Prueba -------------------------

app.get('/', function (req, res) {

  res.json({ mensaje:"Respuesta"})

});

// ------------------------- SUBIR ARCHIVO A S3 -------------------------

app.post('/S3subir', function (req, res) {

  var archivo= req.body.archivo; // Archivo en B64
  var id = req.body.idarchivo; // Nombre del archivo
  
  var nombre = "fotos/" + id; // fotos/ es una carpeta del bucket, carpeta donde se guardaran los archivos
  let buff = new Buffer.from(archivo, 'base64');

  const params = {
    Bucket: "ejemploconferencia", // Nombre del bucket donde se guardara el archivo
    Key: nombre,
    Body: buff,
    ContentType: "image", // Tipo de archivo
    ACL: 'public-read' // Tipo de acceso
  }

  s3.upload(params, function sync(err, data){ //Funcion para subir el archivo a S3
    if(err){
      res.send(err);
    }else{
      res.send(data);
    }
  });

});

// ------------------------- COMPARAR 2 FOTOS EN S3 CON REKOGNITION -------------------------

app.post('/S3Compare', function (req, res) {

  var archivo1= req.body.archivo1; // Variable con el nombre de la foto 1
  var archivo2= req.body.archivo2; // Variable con el nombre de la foto 2

  var params = {
    SimilarityThreshold: 90, 
    SourceImage: {
      S3Object: {
        Bucket: "ejemploconferencia", // Nombre del bucket donde se encuentran ambas fotos
        Name: "fotos/" + archivo1 // fotos/ es una carpeta del bucket, carpeta donde se guardaran los archivos
      }
    }, 
    TargetImage: {
      S3Object: {
        Bucket: "ejemploconferencia",  // Nombre del bucket donde se encuentran ambas fotos
        Name: "fotos/" + archivo2 // fotos/ es una carpeta del bucket, carpeta donde se guardaran los archivos
      }
    }
  };
   
  rek.compareFaces(params, function(err, data) {  // Funcion que compara los rostros de ambas fotos
    if (err) res.send(err);
    else     res.send(data);
  });
  
});