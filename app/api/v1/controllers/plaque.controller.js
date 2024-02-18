const { Plaques, Questions, Responses } = require('../../../models');
const Sequelize = require('sequelize');

const { Op } = Sequelize;

class PlaqueController{
  static async create(req, res) {
    const { name } = req.body;
    const { user } = req.session;
    return Promise.try(async () => {
      const isPlaqueAvailable = await Plaques.findOne({
        where: {
          [Op.and]: { name, UserId: user.id }
        }
      })
      if (isPlaqueAvailable) {
        return res.status(400).json({
          status: 400,
          error: 'Plaque already exists'
        })
      }

      const new_plaque = await Plaques.create({
        name, userId: user.id, UserId: user.id,
      })

      const plaque_data = await Plaques.findByPk(new_plaque.id, {
        attributes:{
          exclude: [
            'url',
            'questionLength',
            'createdAt',
            'updatedAt',
            'UserId',
            'userId']
        },
        include:[
          {
            model: Questions,
            as: 'Questions',
            attributes: {
              exclude: [
                'userId',
                'UserId',
                'createdAt',
                'updatedAt',
              ]
            },
            include: [{
              model: Responses,
              as: 'Responses',
              attributes: {
                exclude: [
                  'questionId',
                  'QuestionId',
                  'createdAt',
                  'updatedAt'
                ]
              }
            }]
          }
        ],
      })

      return res.status(201).json({
        status: 201,
        message: 'Plaque created successfully',
        data: plaque_data,
      });

    }).catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      })
    })
  }

  static async addQuestion(req, res) {
    const { user } = req.session;
    const { plaqueId } = req.params;
    let { question, answer, options, showAnswer } = req.body;

    return Promise.try(async ()=> {
      const plaque = await Plaques.findByPk(plaqueId);
      if (!plaque) {
        return res.status(404).json({
          status: 404,
          error: 'Oops seems plaque does not exist'
        })
      }
      let questionLength = plaque.questionLength;

      if (questionLength >= 15) {
        return res.status(400).json({
          status: 400,
          error: 'Cannot add more than 15 questions into a plaque'
        })
      }
      question = question.trim();
      answer = answer.trim();

      if (options.length > 0) {
        options = options.map((opt) => opt.trim());
      }
      const isFound = await Questions.findOne({
        where: {
          [Op.and]: {question, plaqueId, userId: user.id}
        }
      });
      if (isFound) return res.status(409).json({
        status: 409,
        error: 'Question already exists in plaque',
      });
      const new_questions = await Questions.create({
        question,
        answer,
        options,
        showAnswer,
        plaqueId: plaque.id,
        userId: user.id,
        PlaqueId: plaque.id,
        UserId: user.id
      })
      questionLength++;
      await Plaques.update({
        questionLength
      }, {
        where: {
          id: plaqueId
        }
      })
      const question_data = await Questions.findByPk(new_questions.id, {
        attributes: {
          exclude: [
            'userId',
            'UserId',
            'createdAt',
            'updatedAt',
          ]
        },
        include: [{
          model: Responses,
          as: 'Responses',
          attributes: {
            exclude: [
              'questionId',
              'QuestionId',
              'createdAt',
              'updatedAt'
            ]
          }
        }]
      })
      return res.status(201).json({
        status: 201,
        message: 'Question added successfully',
        data: question_data,
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      })
    })
  }

  static async addResponse(req, res) {
    const { questionId } = req.params;
    let { response, name, school, classInSchool, country, teacherName, responseStatus } = req.body;
    return Promise.try(async () => {
      if(!responseStatus) responseStatus = 'not_applicable';
      const question = await Questions.findByPk(questionId);
      if (!question) {
        return res.status(404).json({
          status: 404,
          error: 'Question not found'
        })
      }

      let author = '';
      response = response.trim();
      let noOfResponses = await question.countResponses();
      if (!name) {
        author += `Anonymous user ${Number(noOfResponses + 1)}`;
      }
      if (name) {
        author = `<b>Name</b>: ${name.toUpperCase().trim()}. <br />`;
        if (school) {
          author += `<b>School</b>: ${school.trim()}. <br />`
        }
        if (classInSchool) {
          author += `<b>Class</b>: ${classInSchool.trim()}.  <br />`
        }
        if (country) {
          author += `<b>Country</b>: ${country.trim()}.  <br />`
        }
        if (teacherName) {
          author += `<b>Teacher's Name</b>: ${teacherName.trim()}.`
        }
      }
      const new_response = await Responses.create({
        response,
        questionId,
        QuestionId: questionId,
        author,
        responseStatus,
      });

      return res.status(201).json({
        status: 201,
        message: 'Response submitted successfully',
        data: new_response,
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      })
    })
  }

  static async getPlaque(req, res) {
    const { plaqueId } = req.params
    return Promise.try(async ()=> {
      const plaque = await Plaques.findByPk(plaqueId, {
        attributes:{
          exclude: [
            'url',
            'questionLength',
            'createdAt',
            'updatedAt',
            'UserId',
            'userId']
        },
        include:[
          {
            model: Questions,
            as: 'Questions',
            attributes: {
              exclude: [
                'userId',
                'UserId',
                'createdAt',
                'updatedAt',
              ]
            },
            include: [{
              model: Responses,
              as: 'Responses',
              attributes: {
                exclude: [
                  'questionId',
                  'QuestionId',
                  'createdAt',
                  'updatedAt'
                ]
              }
            }]
          }
        ],
      });
      if (!plaque) {
        return res.status(404).json({
          status: 404,
          error: 'Plaque does not exist',
        })
      }
      return res.status(200).json({
        status: 200,
        message: 'Plaque retrieved successfully',
        data: plaque,
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      });
    })
  }

  static async getResponses(req, res) {
    const { questionId } = req.params;
    const { user } = req.session;
    return Promise.try(async ()=> {
      const question = await Questions.findByPk(questionId);
      if (!question) {
        return res.status(404).json({
          status: 404,
          error: 'Question does not exist'
        })
      }
      const isOwnQuestion = await user.hasQuestion(questionId);
      if (!isOwnQuestion) {
        return res.status(400).json({
          status: 400,
          error: 'Cannot read responses to this question',
        })
      }
      const responses = await question.getResponses();
      return res.status(200).json({
        status: 200,
        message: 'Responses retrieved successfully',
        data: responses
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      });
    })
  }

  static async getAllPlaques(req, res) {
    const { user } = req.session;
    return Promise.try(async () => {
      const plaqueData = await Plaques.findAll({
        where: {
          UserId: user.id,
        },
        attributes:{
          exclude: [
            'url',
            'questionLength',
            'createdAt',
            'updatedAt',
            'UserId',
            'userId']
        },
        include:[
          {
            model: Questions,
            as: 'Questions',
            attributes: {
              exclude: [
                'userId',
                'UserId',
                'createdAt',
                'updatedAt',
              ]
            },
            include: [{
              model: Responses,
              as: 'Responses',
              attributes: {
                exclude: [
                  'questionId',
                  'QuestionId',
                  'createdAt',
                  'updatedAt'
                ]
              }
            }]
          }
        ],
      });
      return res.status(200).json({
        status: 200,
        message: 'All plaques retrieved',
        data: plaqueData
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      });
    })
  }
  static async deleteAPlaque(req, res) {
    const { plaqueId } = req.params;
    const { user } = req.session;
    return Promise.try( async () => {
      const isFound = await Plaques.findByPk(plaqueId);
      if (!isFound) return res.status(404).json({
        status: 404,
        error: 'Plaque not found'
      })
      await isFound.destroy();

      const plaqueData = await Plaques.findAll({
        where: {
          UserId: user.id,
        },
        attributes:{
          exclude: [
            'url',
            'questionLength',
            'createdAt',
            'updatedAt',
            'UserId',
            'userId']
        },
        include:[
          {
            model: Questions,
            as: 'Questions',
            attributes: {
              exclude: [
                'userId',
                'UserId',
                'createdAt',
                'updatedAt',
              ]
            },
            include: [{
              model: Responses,
              as: 'Responses',
              attributes: {
                exclude: [
                  'questionId',
                  'QuestionId',
                  'createdAt',
                  'updatedAt'
                ]
              }
            }]
          }
        ],
      });
      return res.status(200).json({
        status: 200,
        message: 'Plaque deleted successfully',
        data: plaqueData
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      });
    })
  }

  static async editQuestion(req, res){
    const { user } = req.session;
    const { questionId } = req.params;
    let { question, answer, options, showAnswer } = req.body;
    return Promise.try( async () => {
      const isQuestion = await Questions.findOne({
        where: {
          [Op.and]: {
            userId: user.id,
            id: questionId
          }
        }
      });
      if (!isQuestion) {
        return res.status(404).json({
          status: 404,
          error: 'This question may have been deleted'
        });
      }
      if (options.length > 0) {
        // remove duplicates.
        options = options
          .map((opt) => opt.trim())
          .reduce((a, c) => {
          let curr = c.trim().toLowerCase();
          if(!a.includes(curr)) {
            a.push(curr)
          }
          return a;
        }, []);
      }

      await Questions.update({
        question,
        answer,
        options,
        showAnswer,
      }, {
        where: {
          id: questionId
        }
      })

      const plaqueData = await Plaques.findAll({
        where: {
          UserId: user.id,
        },
        attributes:{
          exclude: [
            'url',
            'questionLength',
            'createdAt',
            'updatedAt',
            'UserId',
            'userId']
        },
        include:[
          {
            model: Questions,
            as: 'Questions',
            attributes: {
              exclude: [
                'userId',
                'UserId',
                'createdAt',
                'updatedAt',
              ]
            },
            include: [{
              model: Responses,
              as: 'Responses',
              attributes: {
                exclude: [
                  'questionId',
                  'QuestionId',
                  'createdAt',
                  'updatedAt'
                ]
              }
            }]
          }
        ],
      });

      return res.status(200).json({
        status: 200,
        message: 'Question updated successfully',
        data: plaqueData,
      });

    }).catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      });
    })
  }

  static async deleteQuestion(req, res){
    const { user } = req.session;
    const { questionId, plaqueId } = req.params;
    return Promise.try( async () => {
      const question = await Questions.findOne({
        where: {
          [Op.and]: {
            userId: user.id,
            id: questionId
          }
        }
      });

      if (!question) {
        return res.status(404).json({
          status: 404,
          error: 'This question may have been deleted'
        });
      }
      await question.destroy();
      // find the exact plaque and update it accordingly;

      const singlePlaque = await Plaques.findOne({
        where: {
          [Op.and]: {userId: user.id, id: plaqueId}
        }
      });

      const plaqueQuestionLength = singlePlaque.questionLength - 1;
      await Plaques.update({
        questionLength: plaqueQuestionLength,
      }, {
        where: {
          [Op.and]: {userId: user.id, id: plaqueId}
        }
      });
      const plaqueData = await Plaques.findAll({
        where: {
          UserId: user.id,
        },
        attributes:{
          exclude: [
            'url',
            'questionLength',
            'createdAt',
            'updatedAt',
            'UserId',
            'userId']
        },
        include:[
          {
            model: Questions,
            as: 'Questions',
            attributes: {
              exclude: [
                'userId',
                'UserId',
                'createdAt',
                'updatedAt',
              ]
            },
            include: [{
              model: Responses,
              as: 'Responses',
              attributes: {
                exclude: [
                  'questionId',
                  'QuestionId',
                  'createdAt',
                  'updatedAt'
                ]
              }
            }]
          }
        ],
      });

      return res.status(200).json({
        status: 200,
        message: 'Question deleted successfully',
        data: plaqueData,
      });

    }).catch((error) => {
      return res.status(500).json({
        status: 500,
        error,
      });
    })
  }
}

module.exports = PlaqueController;