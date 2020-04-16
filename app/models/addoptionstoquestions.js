'use strict';
module.exports = (sequelize, DataTypes) => {
  const addOptionsToQuestions = sequelize.define('addOptionsToQuestions', {
    options: DataTypes.ARRAY(DataTypes.STRING)
  }, {});
  addOptionsToQuestions.associate = function(models) {
    // associations can be defined here
  };
  return addOptionsToQuestions;
};