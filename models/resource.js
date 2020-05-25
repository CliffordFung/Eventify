'use strict';

module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    resourceName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Resource.associate = function(models) {
    // associations can be defined here

    Resource.belongsTo(models.Event);
    Resource.belongsToMany(models.User, {through: 'UsersBringingResources'});
  };
  return Resource;
};