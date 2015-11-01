'use strict';
module.exports = function(sequelize, DataTypes) {
  var campaign = sequelize.define('campaign', {
    name: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true
      }
    },
    identifier: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        min: 8
      }
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'Virtual'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Active'
    },
    desc: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return campaign;
};