'use strict';
// Seeds are used to create dummy data in the Database
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Categories', [{
        name: 'Sports',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Entertainment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Music',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fitness',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Visual Arts',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Film',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fashion',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Food & Drink',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Festivals & Fairs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nightlife',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kids & Family',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wedding',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Other',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};