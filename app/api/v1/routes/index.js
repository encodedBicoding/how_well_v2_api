const express = require('express');
const UserController = require('../controllers/users.controller');
const PlaqueController = require('../controllers/plaque.controller');
const checkSession = require('../middlewares/checkSession');


const { register, login, getProfile } = UserController;
const { 
  create,
  addQuestion,
  addResponse,
  getPlaque,
  getResponses,
  getAllPlaques,
} = PlaqueController

const route = express();

route.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome to hwdykm',
  app_version: 'v1',
  app_name: 'How well do you know me',
}));
// validate inputs
route.get('/user/profile', checkSession, getProfile)
route.post('/register', register);
route.post(
  '/login',
  login
);
route.post(
  '/new/plaque/',
  checkSession,
  create,
)

route.get(
  '/:userName/plaque/:plaqueId',
  getPlaque,
)

route.get(
  '/plaque/:questionId',
  checkSession,
  getResponses
)

route.post(
  '/new/question/:plaqueId',
  checkSession,
  addQuestion
)
route.post(
  '/new/response/:questionId',
  addResponse
)

route.get(
  '/all/plaque',
  checkSession,
  getAllPlaques
)


module.exports = route