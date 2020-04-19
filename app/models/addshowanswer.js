'use strict';
module.exports = (sequelize, DataTypes) => {
  const addShowAnswer = sequelize.define('addShowAnswer', {
    showAnswer: DataTypes.BOOLEAN
  }, {});
  addShowAnswer.associate = function(models) {
    // associations can be defined here
  };
  return addShowAnswer;
};