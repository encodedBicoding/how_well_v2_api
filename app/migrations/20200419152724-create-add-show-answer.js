'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Questions','showAnswer', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Questions', 'showAnswer');
  }
};