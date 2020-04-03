const express = require('express');
const UserController = require('../controllers/users.controller');
const PlaqueController = require('../controllers/plaque.controller');
const checkSession = require('../middlewares/checkSession');
const {
  validateRegister,
  validateLogin,
  validatePlaqueId,
  validateQuestionId,
  validateAddQuestion,
  validateCreatePlaque
} = require('../middlewares/validate');


const { register, login, getProfile, findUserByUserName } = UserController;
const { 
  create,
  addQuestion,
  addResponse,
  getPlaque,
  getResponses,
  getAllPlaques,
  deleteAPlaque,
} = PlaqueController

const route = express();

route.get('/', (req, res) => res.status(200).json({
  status: 200,
  message: 'Welcome to hwdykm',
  app_version: 'v1',
  app_name: 'How well do you know me',
}));
// validate inputs
route.get('/user/profile', checkSession, getProfile);
route.get('/user/check/:userName', findUserByUserName);
route.post(
  '/register',
  validateRegister,
  register
);
route.post(
  '/login',
  validateLogin,
  login
);
route.post(
  '/new/plaque/',
  validateCreatePlaque,
  checkSession,
  create,
)
route.delete(
  '/delete/plaque/:plaqueId',
  validatePlaqueId,
  checkSession,
  deleteAPlaque,
)
route.post(
  '/new/question/:plaqueId',
  validatePlaqueId,
  validateAddQuestion,
  checkSession,
  addQuestion
)

route.get(
  '/plaque/:plaqueId',
  validatePlaqueId,
  getPlaque,
)

route.get(
  '/plaque/:questionId',
  validateQuestionId,
  checkSession,
  getResponses
)


route.post(
  '/new/response/:questionId',
  validateQuestionId,
  addResponse
)

route.get(
  '/all/plaque',
  checkSession,
  getAllPlaques
)


module.exports = route