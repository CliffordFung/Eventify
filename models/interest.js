'use strict';
module.exports = (sequelize, DataTypes) => {
  const Interest = sequelize.define('Interest', {
    interestName: {
      type: DataTypes.STRING,
      primaryKey:true
    }
  }, {});
  Interest.associate = function(models) {
    // associations can be defined here
    Interest.belongsToMany(models.User, {through:'UserInterests', foreignKey:'interestName'});
  };
  return Interest;
};