'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Events', [{
      eventName: 'Netflix and Chill Party',
      eventDate: new Date('December 17, 1995 03:24:00'),
      description: 'Come watch stranger things!',
      eventAddress: '999 Canada Pl, Vancouver, BC V6C 3T4',
      maxCapacity: 50,
      numberAttending: 5,
      status: 'planned',
      startTime: new Date('December 17, 1995 03:24:00'),
      endTime: new Date(),
      latitude: 49.287411,
      longitude: -123.111359,
      createdAt: new Date(),
      updatedAt: new Date()
  },
  {
    eventName: 'Fundraiser for Cancer Research',
    eventDate: new Date('December 17, 1995 03:24:00'),
    description: 'Come out and support a good cause',
    eventAddress: '601 Keefer St, Vancouver, BC V6A 3V8',
    maxCapacity: 50,
    numberAttending: 5,
    status: 'planned',
    startTime: new Date('December 17, 1995 03:24:00'),
    endTime: new Date(),
    latitude: 49.2804018,
    longitude: -123.0923278,
    createdAt: new Date(),
    updatedAt: new Date()
},
{
  eventName: 'Wedding Reception',
  eventDate: new Date('December 17, 1995 03:24:00'),
  description: 'BYOB',
  eventAddress: '80 Walter Hardwick Ave, Vancouver, BC V5Y 0C3',
  maxCapacity: 50,
  numberAttending: 5,
  status: 'planned',
  startTime: new Date('December 17, 1995 03:24:00'),
  endTime: new Date(),
  latitude: 49.2707714,
  longitude: -123.1079101,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  eventName: 'Group Yoga',
  eventDate: new Date('December 17, 1995 03:24:00'),
  description: 'Have fun and meet cool people!',
  eventAddress: '1030 Bute St, Vancouver, BC V6E 1J2',
  maxCapacity: 50,
  numberAttending: 5,
  status: 'planned',
  startTime: new Date('December 17, 1995 03:24:00'),
  endTime: new Date(),
  latitude: 49.2817866,
  longitude: -123.1270957,
  createdAt: new Date(),
  updatedAt: new Date()
},
  {
    eventName: 'SFU Hackathon',
    eventDate: new Date('December 17, 1995 03:24:00'),
    description: 'Come do the coding',
    eventAddress: '8888 University Dr, Burnaby, BC V5A 1S6',
    maxCapacity: 50,
    numberAttending: 5,
    status: 'planned',
    startTime: new Date('December 17, 1995 03:24:00'),
    endTime: new Date(),
    latitude: 49.2781868,
    longitude: -122.9144686,
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Events', null, {});
  }
};
