const { check, validationResult, param } = require('express-validator');
const validateRegister =   [
  [
    check('userName')
    .isAlpha()
    .withMessage('Username must only contain alphabetical characters')
    .isLength({ min: 2 })
    .withMessage('Username must be atleast 2 characters long'),
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
    .withMessage('Username must only contain alphabetical characters')
    .isLength({ min: 2 })
    .withMessage('Username must be atleast 2 characters long'),
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

const validateDeleteQuestion = [
  [
    param('questionId')
      .isInt()
      .withMessage('Question ID must have type integer'),
    param('plaqueId')
      .isInt()
      .withMessage('Plaque ID must have type integer'),
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
]
const validateEmailParam = [
  [
    param('email')
      .isEmail()
      .withMessage('Invalid Email')
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
]
const validateAddQuestion = [
  [
    check('question')
      .notEmpty()
      .withMessage('Question cannot be empty'),
    check('answer')
      .notEmpty()
      .withMessage('Answer cannot be empty')
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
]
const validateCreatePlaque = [
  [
    check('name')
      .notEmpty()
      .withMessage('Plaque cannot be empty'),
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
]
const validatePassword = [
  [
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
const validateEmail =   [
  [
  check('email')
    .isEmail()
    .withMessage('Please add a valid email'),
  ],
  (req, res, next)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    return next();
  } 
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePlaqueId,
  validateQuestionId,
  validateAddQuestion,
  validateCreatePlaque,
  validatePassword,
  validateEmail,
  validateEmailParam,
  validateDeleteQuestion,
};