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

  }, 
  {
    tableName: 'Plaques',
    timestamps: true,
  }
  );
  Plaques.associate = function(models) {
    // associations can be defined here
    Plaques.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
    Plaques.hasMany(models.Questions, {
      onDelete: 'CASCADE',
      as: 'Questions',
    })
  };
  return Plaques;
};