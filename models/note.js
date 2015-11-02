'use strict';
module.exports = function(sequelize, DataTypes) {
  var note = sequelize.define('note', {
    author: DataTypes.STRING,
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    campaignId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.note.belongsTo(models.campaign)
        models.note.hasMany(models.comment)
      }
    }
  });
  return note;
};