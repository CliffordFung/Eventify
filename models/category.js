'use strict';

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    getterMethods: {
      getAssociatedEventsUrl(){
        return '/categories/' + this.id + '/events';
      }
    }
  });
  Category.associate = function(models) {
    // associations can be defined here
    Category.belongsToMany(models.Event, {through: 'EventCategories', foreignKey: 'categoryId', otherKey:'eventId'});
  };
  return Category;
};