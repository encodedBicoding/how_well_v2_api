'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plaques = sequelize.define('Plaques', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionLength:  {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'no-url'
    },

  }, 
  {
    tableName: 'Plaques',
    timestamps: true,
  }
  );
  Plaques.associate = function(models) {
    // associations can be defined here
    Plaques.belongsTo(models.Users, {
      foreignKey: 'userId'
    });
    Plaques.hasMany(models.Questions, {
      as: 'Questions',
      onDelete: 'CASCADE'
    })
  };
  return Plaques;
};