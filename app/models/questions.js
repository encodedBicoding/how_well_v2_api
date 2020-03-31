'use strict';
module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Questions', {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plaqueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'Questions',
    timestamps: true,
  });
  Questions.associate = function(models) {
    // associations can be defined here
    Questions.belongsTo(models.Plaques, {
      foreignKey: 'plaqueId',
    });
    Questions.belongsTo(models.Users, {
      foreignKey: 'userId',
    })
    Questions.hasMany(models.Responses, {
      as: 'Responses',
      onDelete: 'CASCADE',
    })
  };
  return Questions;
};