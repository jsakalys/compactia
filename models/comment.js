'use strict';
module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define('comment', {
    author: {
      type: DataTypes.STRING,
    },
    body: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    noteId: {
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.comment.belongsTo(models.note);
      }
    }
  });
  return comment;
};