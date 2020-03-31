const j_w_t = require('jsonwebtoken');
const {config} = require('dotenv');
config();

const jwt = {}
jwt.secret = process.env.SECRET_KEY;

jwt.sign = async function(payload, expiresIn = '24h') {
  return j_w_t.sign(payload, this.secret, { expiresIn });
}
jwt.verify = async function(token) {
  let decoded;
  try {
    decoded = j_w_t.verify(token, this.secret);
    return decoded;
  } catch (error) {
    return false;
  }
};

module.exports = jwt;