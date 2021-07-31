const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');
const { Users }  = require('../../../models');
const Sequelize = require('sequelize');
const mailer = require('../helpers/mail');

const { Op } = Sequelize;

class UserController {
  static async register(req, res) {
    let { userName, email, password } = req.body;
    userName = userName.toLowerCase();
    email = email.toLowerCase();
    return Promise.try(async () => {
      const isFound = await Users.findOne({
        where: {
          [Op.or]: { userName, email }
        }
      })
      if(isFound) {
        return res.status(401).json({
          status: 401,
          error: 'A user with the given email or username already exists'
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
        error: 'error occured from creating user',
        errorObj: error,
      })
    })
  }
  static async login(req, res) {
    let { userName, password} = req.body;
    userName = userName.toLowerCase();
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
  static async findUserByUserName(req, res) {
    const { userName } = req.params;
    return Promise.try(async () => {
      const isFound = await Users.findOne({
        where: {
          userName,
        },
      });
      if (!isFound) {
        return res.status(404).json({
          status: 404,
          error: 'User not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: isFound.getSafeDataValues(),
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      })
    })
  }

  static async resetPasswordOne(req, res) {
    const { email } = req.body;
    return Promise.try( async() => {
      const isUser = await Users.findOne({
        where: {
          email,
        }
      });
      if (!isUser) return res.status(404).json({
        status: 404,
        error: 'No user with the given email',
      });
      const ONE_TIME_RESET_TOKEN = await jwt.sign({email});
  
      const FE_BASE_URL='https://fe-hwdykm.herokuapp.com';
      // send mail.
      const msg = {
        to: email,
        from: 'noreply@hwdykm.xyz',
        subject: 'Password Recovery',
        html: `
          <h3>Hello ${isUser.userName.toUpperCase()},</h3>
          <p>There was a recent request on our servers for a password reset for this email address</p>
          <p>If you didn't perform this action, please send an email to <a href='mailto:hwdykm2me@gmail.com'>hwdykm2me@gmail.com</a></p>
          <br/>
          <h4>Follow the link to reset your password: <a href='${FE_BASE_URL}/rp/${ONE_TIME_RESET_TOKEN}/${email}'>RESET PASSWORD</a></h4>
        `
      }
      await mailer.send(msg);

      await Users.update({
        resetToken: ONE_TIME_RESET_TOKEN,
      }, {
        where: {
          email,
        },
      });

      return res.status(200).json({
        status: 200,
        message: 'A password reset link has been sent to your email'
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      });
    })
  } 

  static async resetPasswordTwo(req, res) {
    const { rt, email } = req.params;
    const { password } = req.body;
    return Promise.try( async () => {
      const isUser = await Users.findOne({
        where: {
          email,
        }
      })
      if (!isUser) return res.status(404).json({
        status: 404,
        error: 'Unfortunately, user does not exist',
      });

      if (!isUser.resetToken) return res.status(404).json({
        status: 404,
        error: 'No reset password request for this account',
      });
      let token_used = await jwt.verify(rt);
      if (!token_used) return res.status(409).json({
        status: 409,
        error: 'Token is invalid',
      })
      let token_in_db = await jwt.verify(isUser.resetToken);
      
      if (token_used.email !== token_in_db.email) return res.status(409).json({
        status: 409,
        error: 'Token is invalid',
      })
      const saltRounds = 8;
      const new_pasword_hashed = await bcrypt.hash(password, saltRounds);
      
      await Users.update({
        resetToken: null,
        password: new_pasword_hashed,
      },{
        where: {
          email: email,
        }
      })

      return res.status(200).json({
        status: 200,
        message: 'Password reset successfully'
      })

    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      });
    })
  }
}

module.exports = UserController;