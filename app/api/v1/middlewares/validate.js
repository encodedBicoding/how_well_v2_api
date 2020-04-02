const { check, validationResult, param } = require('express-validator');
const validateRegister =   [
  [
    check('userName')
    .isAlpha()
    .withMessage('Must only contain alphabetical characters')
    .isLength({ min: 2 })
    .withMessage('Must be at least 2 chars long'),
  check('email')
    .isEmail()
    .withMessage('Please add a valid email'),
  check('password')
    .isLength({min: 8})
    .withMessage('Password must be atleast 8 characters long')
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
];

const validateLogin = [
  [
    check('userName')
    .isAlpha()
    .withMessage('Must only contain alphabetical characters')
    .isLength({ min: 2 })
    .withMessage('Must be at least 2 chars long'),
  check('password')
    .isLength({min: 8})
    .withMessage('Password must be atleast 8 characters long')
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
]

const validatePlaqueId = [
  [
    param('plaqueId')
      .isInt()
      .withMessage('Plaque ID must have type integer')
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
]
const validateQuestionId = [
  [
    param('questionId')
      .isInt()
      .withMessage('Question ID must have type integer')
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
]

module.exports = {
  validateRegister,
  validateLogin,
  validatePlaqueId,
  validateQuestionId
};