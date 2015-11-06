'use strict';
module.exports = function(sequelize, DataTypes) {
  var attribute = sequelize.define('attribute', {
    race: DataTypes.STRING,
    class: DataTypes.STRING,
    birthplace: DataTypes.STRING,
    gender: DataTypes.STRING,
    hp: DataTypes.INTEGER,
    def: DataTypes.INTEGER,
    characterId: DataTypes.INTEGER,
    desc: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.attribute.belongsTo(models.character)
      }
    }
  });
  return attribute;
};