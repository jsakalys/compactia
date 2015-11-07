'use strict';
module.exports = function(sequelize, DataTypes) {
  var character = sequelize.define('character', {
    name: {
      type: DataTypes.STRING,
    },
    exp: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    gold: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profile: {
      type: DataTypes.STRING
    },
    environment: {
      type: DataTypes.STRING
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.character.belongsTo(models.user);
        models.character.belongsTo(models.campaign);
        models.character.hasOne(models.attribute);
      }
    }
  });
  return character;
};