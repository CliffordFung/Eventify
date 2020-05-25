'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.createTable(
      'UsersBringingResources',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        resourceId:{
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        eventId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      }
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UsersBringingResources');
  }
};
