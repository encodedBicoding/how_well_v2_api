const jwt = require('../helpers/jwt');
const { Users } = require('../../../models');

const checkSession = async function checkSession(req, res, next) {
  let token;
  req.session = {};
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: 401,
      error: 'Authentication error'
    })
  }
  if (req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    token = req.headers.authorization;
  }
  const isAuth = await jwt.verify(token);

  if (!isAuth) {
    return res.status(401).json({
      status: 401,
      error: 'Authentication Error'
    })
  }

  const user = await Users.findOne({
    where: {
      userName: isAuth.userName
    }
  })
  req.session.user = user;

  next();
}

module.exports = checkSession;