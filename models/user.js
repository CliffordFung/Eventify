'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false
        },
        gender: DataTypes.STRING,
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating: DataTypes.DOUBLE,
        bio: DataTypes.STRING
    }, {
        getterMethods: {
            fullName(){
                return this.firstName + ' ' + this.lastName;
            },
            profileUrl(){
                return '/users/' + this.id + '/profile';
            },
            myEventsUrl(){
                return '/users/' + this.id + '/events';
            }
        }
    });
    
    User.associate = function(models) {
        // associations can be defined here
        //User can attend many events
        User.belongsToMany(models.Event, {through: 'EventAttendance'});
        User.belongsToMany(models.Resource, {through: 'UsersBringingResources'});
        //User can host many events.
        User.hasMany(models.Event);
        User.belongsToMany(models.Interest, {through:'UserInterests', foreignKey:'id'});
    };

    User.beforeCreate(user => {
        user.password = bcrypt.hashSync(
            user.password,
            bcrypt.genSaltSync(10),
            null
        );
    });

    User.prototype.validPassword = function(password){
        return bcrypt.compareSync(password, this.password);
    }

    return User;
};