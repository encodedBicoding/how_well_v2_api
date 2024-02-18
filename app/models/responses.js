'use strict';
module.exports = (sequelize, DataTypes) => {
  const Responses = sequelize.define('Responses', {
    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Annonymous User'
    },
    responseStatus: {
      type: DataTypes.ENUM('correct', 'wrong', 'not_applicable'),
      allowNull: false,
      defaultValue: 'not_applicable'
    }
  },
  {
    tableName: 'Responses',
    timestamps: true,
  });
  Responses.associate = function(models) {
    // associations can be defined here
    Responses.belongsTo(models.Questions, {
      foreignKey: 'questionId',
    })
  };
  return Responses;
};