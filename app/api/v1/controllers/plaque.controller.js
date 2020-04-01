const { Plaques, Questions, Responses } = require('../../../models');

class PlaqueController{
  static async create(req, res) {
    const { name } = req.body;
    const { user } = req.session;
    return Promise.try(async () => {
      const isPlaqueAvailable = await Plaques.findOne({
        where: {
          name,
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

      const plaque_url = `https://api-hwdykm.herokuapp.com/api/v1${user.userName}/plaque/${new_plaque.id}`;

      await Plaques.update({
        url: plaque_url
      }, {
        where: {
          id: new_plaque.id
        }
      })

      return res.status(201).json({
        status: 201,
        message: 'Plaque created successfully',
        data: new_plaque
      })

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
    let { question } = req.body;

    return Promise.try(async ()=> {
      const plaque = await Plaques.findByPk(plaqueId);
      if (!plaque) {
        return res.status(404).json({
          status: 404,
          error: 'Oops seems plaque does not exist'
        })
      }
      let questionLength = plaque.questionLength;

      if (questionLength >= 5) {
        return res.status(400).json({
          status: 400,
          error: 'Cannot add more than 5 questions into a plaque'
        })
      }
      question = question.trim();
      const new_questions = await Questions.create({
        question,
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
      return res.status(201).json({
        status: 201,
        message: 'Question added successfully',
        data: new_questions,
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
    let { response } = req.body;

    return Promise.try(async () => {
      const question = await Questions.findByPk(questionId);
      if (!question) {
        return res.status(404).json({
          status: 404,
          error: 'Question not found'
        })
      }
      response = response.trim();
      let noOfResponses = await question.countResponses();
      let author = `Annonymous user ${Number(noOfResponses + 1)}`;
      const new_response = await Responses.create({
        response,
        questionId,
        QuestionId: questionId,
        author
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
    const { userName, plaqueId } = req.params
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
                'plaqueId',
                'userId',
                'UserId',
                'createdAt',
                'updatedAt',
                'PlaqueId']
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
                'plaqueId',
                'userId',
                'UserId',
                'createdAt',
                'updatedAt',
                'PlaqueId']
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
}

module.exports = PlaqueController;