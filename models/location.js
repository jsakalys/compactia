'use strict';
module.exports = function(sequelize, DataTypes) {
  var location = sequelize.define('location', {
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    zip: DataTypes.STRING,
    campaignId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.location.belongsTo(models.campaign)
      }
    }
  });
  return location;
};