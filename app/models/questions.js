'use strict';
module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define('Questions', {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
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
      onDelete: 'CASCADE',
      as: 'Responses',
    })
  };
  return Questions;
};