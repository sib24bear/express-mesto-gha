const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const authorization = req.cookies.token;

  if (!authorization) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(authorization, SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};
