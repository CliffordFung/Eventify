'use strict';

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    eventName: {
      type:DataTypes.STRING,
      allowNull:false
    },
    eventDate:{
      type:DataTypes.DATEONLY,
      allowNull:false
    },
    description: DataTypes.STRING,
    eventAddress: {
      type:DataTypes.STRING,
      allowNull:false
    },
    maxCapacity: DataTypes.INTEGER,
    numberAttending: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['planned', 'ongoing', 'completed', 'cancelled']
    },
    startTime:{
      type:DataTypes.DATE
    },
    endTime: {
      type:DataTypes.DATE
    },
    latitude:{
      type:DataTypes.DOUBLE,
      allowNull:false
    },
    longitude: {
      type:DataTypes.DOUBLE,
      allowNull:false
    },
    hostId:{
     type: DataTypes.INTEGER,
    }
  }, {
    getterMethods: {
      eventDetailUrl(){
        return '/events/' + this.id;
      },
      eventUpdateURL(){
        return '/events/' + this.id + '/update/';
      },
      eventDeleteURL(){
        return '/events/' + this.id + '/delete/';
      }
    }
  });
  Event.associate = function(models) {
    // associations can be defined here
    Event.hasMany(models.Resource);
    Event.belongsToMany(models.Category, {through: 'EventCategories', foreignKey: 'eventId', otherKey:'categoryId'});
    //Event can be attended by many users
    Event.belongsToMany(models.User, {through: 'EventAttendance'});
    //Event can only be hosted by one user
    Event.belongsTo(models.User)
  };
  return Event;
};