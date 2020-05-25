'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable(
      'EventAttendance',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        eventId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('EventAttendance');
  }
};
