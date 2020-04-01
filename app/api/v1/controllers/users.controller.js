const Promise = require('bluebird');
const jwt = require('../helpers/jwt');
const { Users }  = require('../../../models');

class UserController {
  static async register(req, res) {
    const { userName, email, password } = req.body;
    return Promise.try(async () => {
      const isFound = await Users.findOne({
        where: {
          email
        }
      })

      if(isFound) {
        return res.status(401).json({
          status: 401,
          error: 'A user with the given email already exists'
        })
      }
      const SESSION_TOKEN = await jwt.sign({userName, password});

      const NEW_USER = await Users.create({userName, email, password});

      return res.status(201).json({
        status: 201,
        message: 'Account created successfully',
        user: NEW_USER.getSafeDataValues(),
        token: SESSION_TOKEN
      })
    }).catch((error)=> {
      return res.status(500).json({
        status: 500,
        error,
      })
    })
  }
  static async login(req, res) {
    const { userName, password} = req.body;
    return Promise.try(async ()=> {
      const user = await Users.findOne({
        where: {
          userName
        }
      });
      if (!user ) return res.status(404).json({
        status: 404,
        error: 'Username does not exists'
      })
      // check password
      const isCorrect = await user.decryptPassword(password);
      if (!isCorrect) {
        return res.status(409).json({
          status: 409,
          error: 'username/password is incorrect'
        })
      }

      const SESSION_TOKEN = await jwt.sign({userName, password});
      return res.status(200).json({
        status: 200,
        message: 'log in successfully',
        data: user.getSafeDataValues(),
        token: SESSION_TOKEN
      })
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).json({
        status: 500,
        error,
      })
    })
  }
  static async getProfile(req, res) {
    const { user } = req.session;
    return Promise.try(async () => {
      const USER = await Users.findByPk(user.id, {
        attributes: {
          exclude: [
            'createdAt', 
            'updatedAt', 
            'password'
          ]
        }
      });
      return res.status(200).json({
        status: 200,
        message: 'Profile retrieved successfully',
        data: USER,
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      })
    })
  }
}

module.exports = UserController;