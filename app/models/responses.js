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