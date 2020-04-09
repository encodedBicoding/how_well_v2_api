'use strict';
const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resetToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'Users',
    timestamps: true,
  });
  Users.beforeCreate(async (user) => {
    user.password = await user.encryptPassword();
  });

  Users.prototype.encryptPassword = async function encryptPassword() {
    const saltRounds = 8;
    return bcrypt.hash(this.password, saltRounds);
  };

  Users.prototype.decryptPassword = async function decryptPassword(password) {
    return bcrypt.compare(password, this.password);
  };
  Users.prototype.getSafeDataValues = function getSafeDataValues() {
    const { password, ...data } = this.dataValues;
    return data;
  };
  Users.associate = function(models) {
    // associations can be defined here
    Users.hasMany(models.Plaques, {
      onDelete: 'CASCADE',
      as: 'Plaques'
    });
    Users.hasMany(models.Questions, {
      onDelete: 'CASCADE',
      as: 'Questions'
    })
  };
  return Users;
};