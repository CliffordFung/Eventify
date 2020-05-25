'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventName: {
        type: Sequelize.STRING,
        allowNull:false
      },
      eventDate: {
        type: Sequelize.DATEONLY,
        allowNull:false
      },
      description: {
        type: Sequelize.STRING
      },
      eventAddress: {
        type: Sequelize.STRING,
        allowNull:false
      },
      maxCapacity: {
        type: Sequelize.INTEGER
      },
      numberAttending: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM,
        values: ['planned', 'ongoing', 'completed', 'cancelled']
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull:false
      },
      longitude: {
        type: Sequelize.DOUBLE,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Events');
  }
};