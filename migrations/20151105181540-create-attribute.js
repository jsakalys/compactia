'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('attributes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      race: {
        type: Sequelize.STRING
      },
      class: {
        type: Sequelize.STRING
      },
      birthplace: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      hp: {
        type: Sequelize.INTEGER
      },
      def: {
        type: Sequelize.INTEGER
      },
      characterId: {
        type: Sequelize.INTEGER
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('attributes');
  }
};