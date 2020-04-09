'use strict';
module.exports = (sequelize, DataTypes) => {
  const addTokenColumnToUser = sequelize.define('addTokenColumnToUser', {
    resetToken: DataTypes.TEXT
  }, {});
  addTokenColumnToUser.associate = function(models) {
    // associations can be defined here
  };
  return addTokenColumnToUser;
};