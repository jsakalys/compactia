'use strict';
var bcrypt = require("bcryptjs");

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
        models.user.belongsToMany(models.campaign, {through: "usersCampaigns"});
        models.user.hasMany(models.character);
        models.user.hasMany(models.provider);
        models.user.hasMany(models.note);
      },
      authenticate: function(email, password, callback) {
        this.find({where: {email: email}}).then(function(user) {
          if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
              if (err) {
                callback(err);
              } else {
                callback(null, result ? user : false);
              }
            });
          } else {
            callback(null, false);
          }
        }).catch(callback);
      }
    },
    instanceMethods: {
      checkPassword: function(password, callback){
        if (password && this.password) {
          bcrypt.compare(password, this.password, callback);
        } else {
          callback(null, false);
        }
      }
    },
    hooks: {
      beforeCreate: function(user, options, callback) {
        if (!user.password) return callback(null, user);
        bcrypt.hash(user.password, 10, function(err, hash) {
          if (err) return callback(err);
          user.password = hash;
          callback(null, user);
        });
      }
    }
  });
  return user;
};