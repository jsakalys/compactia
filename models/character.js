'use strict';
module.exports = function(sequelize, DataTypes) {
  var character = sequelize.define('character', {
    name: {
      type: DataTypes.STRING,
      defaultValue: '',
      validate: {
        isAlphanumeric: true
      }
    },
    exp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true
      }
    },
    gold: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: true
      }
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return character;
};