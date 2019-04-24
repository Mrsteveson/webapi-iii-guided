const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');
const server = express();

// working**
function greeter(teamName) {
  return function(req, res, next) {
    req.team = teamName;

    next();
  };
}

// working**
function timeout(req, res, next) {
  const seconds = new Date().getSeconds();
  
  if(seconds % 3 === 0) {
    next(1337);
  } else {
    next();
  }
}

// configure global middleware (located before you reach the endpoints)
server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(greeter('Web XVIII'));
server.use(timeout);

// Configure route handlers/endpoints/request handlers
server.use('/api/hubs', restricted, nameCheck('gimli'), hubsRouter);

server.get('/', (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team}</p>
    `);
});

// server calling errorhandler
server.use(errorHandler);
// errorhandler middleware
function errorHandler (err, req, res, next) {
  res.status(400).send('Houston, we have a problem.')
}

// checks the key "name": matches the name passed in (gimli).
function nameCheck(name) {
  return function(req, res, next) {
    if(name === req.headers.name) {
      next();
    } else {
      res.status(403).send('you are not who I want.')
    }
  }
}

// checks for password before moving onto hubsRouter/data
function restricted(req, res, next) {
  const password = req.headers.password;

  if(password === 'mellon') {
    next();
  } else {
    res.status(401).send('not today buddy')
  }
}

module.exports = server;

// Three ways to read data from the body: the url params, query string, and headers.

// three types of middleware: built-in, third party, and custom.
// Can use middleware locally or globally.

// npmjs.com, find the 'morgan' module and use it as global middleware