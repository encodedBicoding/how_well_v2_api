require('babel-polyfill');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { config } = require('dotenv');
const log = require('fancy-log');
const enforce = require('express-sslify');
const compression = require('compression');
const errorHandler = require('errorhandler');
const RouteV1 = require('./api/v1/routes');
const cookieParser = require('cookie-parser');

config();


const app = express();
app.enable('trust proxy');

app.use(cookieParser())
app.use(helmet());

const accepted_urls = [
  'http://localhost:8083',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://fe-hwdykm.herokuapp.com',
  'https://fe-hwdykm.herokuapp.com/',
  'https://naughty-nobel-33df29.netlify.com',
  'https://hwdykm.xyz',
  'https://www.hwdykm.xyz',
  'http://hwdykm.xyz',
  'http://www.hwdykm.xyz',
  'https://how-well-fe-v2.onrender.com',
  'https://how-well-fe-v2.onrender.com/'
];
const corsOption = {
  origin: (origin, cb) => {
    if (accepted_urls.includes(origin)) {
      return cb(null, true);
    }
    return cb(null, false);
  },
  credentials: true,
};

const PORT = parseInt(process.env.PORT, 10) || 4000;
const isProduction = app.get('env') === 'production';

app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '50mb'}))
app.use(cors(corsOption));
if (isProduction) app.use(enforce.HTTPS());
if (!isProduction) {
  app.use(errorHandler({
    dumpExceptions: true,
    showStack: true,
  }));
} else {
  app.use(errorHandler());
}

app.use(compression());
app.get('/', (req, res) => res.redirect('/api/v1'));

app.use('/api/v1', RouteV1);

app.use((req, res, next) => {
  const err = new Error('Resource does not exist');
  err.status = 404;
  next(err);
});
if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    log(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message,
        error: err,
      },
      status: false,
    });
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  log(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      error: {},
    },
    status: false,
  });
});

app.on('error', (error) => {
  log.error(error);
});


process.on('uncaughtException', (error) => {
  log.error('uncaughtException ', error.message);
  log.error(error.stack);

  // More work to be done here
  // you should send DevOps the stack error via mail and/or sms
  process.exit(1);
});

app.listen(PORT, () => {
  if (!isProduction) log(`App running on port ${PORT}`);
});

module.exports = app;

