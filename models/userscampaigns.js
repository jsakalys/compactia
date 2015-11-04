'use strict';
module.exports = function(sequelize, DataTypes) {
  var usersCampaigns = sequelize.define('usersCampaigns', {
    userId: DataTypes.INTEGER,
    campaignId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return usersCampaigns;
};