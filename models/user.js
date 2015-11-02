'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      isUnique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
        // isUnique: sequelize.validateIsUnique('email')
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        min: 8
      }
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.hasMany(models.campaign);
        models.user.hasMany(models.character);
      }
    }
  });
  return user;
};