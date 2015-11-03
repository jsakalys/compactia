'use strict';
var bcrypt = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
  var campaign = sequelize.define('campaign', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    identifier: {
      type: DataTypes.STRING,
      isUnique: true,
      validate: {
        isAlphanumeric: true,
        // sequelize.validateIsUnique('identifier')
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        min: 8
      }
    },
    type: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.campaign.belongsTo(models.user);
        models.campaign.hasMany(models.character);
        models.campaign.hasMany(models.note);
      }
    },
    hooks: {
      beforeCreate: function(campaign, options, callback) {
        if (!campaign.password) return callback(null, campaign);
        bcrypt.hash(campaign.password, 10, function(err, hash) {
          if (err) return callback(err);
          campaign.password = hash;
          callback(null, campaign);
        });
      }
    }
  });
  return campaign;
};