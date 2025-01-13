'use strict';

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    const password = process.env.ADMIN_PASSWORD;
    const hasPassword = bcrypt.hashSync(password, 10);
    return queryInterface.bulkInsert('users', [
      {
        userType: '0',
        firstName: 'Admin_first_name',
        lastName: 'Admin_last_name',
        email: process.env.ADMIN_EMAIL,
        password: hasPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', {userType: '0'}, {});
  },
};
