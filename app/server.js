var express = require('express');
var app = express();
var port = process.env.PORT || 8090;
var favicon = require('serve-favicon');
var path = require('path');
var cors = require('cors');

app.use(cors());

// configurar cabeceras http

const allowedOrigins = [
  'capacitor://localhost',
  'https://localhost:8445'
];

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  }
}

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res, next) => {
  res.json({ message: 'This route is CORS-enabled for an allowed origin.' });
})

app.listen(3000, () => {
  console.log('CORS-enabled web server listening on port 3000');
});