'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Questions', 'options', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
      defaultValue: [],
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Questions', 'options');
  }
};