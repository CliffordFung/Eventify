'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Events', // name of Source model
      'hostId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        //TODO: On Delete set to NULL to update events to cancelled with null hosts.
        onDelete: 'SET NULL',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Events', // name of Source model
      'hostId' // key we want to remove
    );
  }
};