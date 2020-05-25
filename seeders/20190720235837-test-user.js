'use strict';
const bcrypt = require('bcryptjs');
// Seeds are used to create dummy data in the Database
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            username: 'johndoe',
            firstName: 'John',
            lastName: 'Doe',
            password: bcrypt.hashSync('password1', bcrypt.genSaltSync(10), null),
            email: 'test@test.com',
            dateOfBirth: new Date('December 17, 1995 03:24:00'),
            gender: 'male',
            city: 'Vancouver',
            country: 'Canada',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};