'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('Responses', 'responseStatus', {
      type: Sequelize.ENUM('correct', 'wrong', 'not_applicable'),
      allowNull: false,
      defaultValue: 'not_applicable',
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Responses', 'responseStatus');
  }
};
