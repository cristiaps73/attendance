'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Elimină cheia primară existentă
    await queryInterface.removeConstraint('Attendees', 'Attendees_pkey');

    // Schimbă tipul coloanei `id` la UUID
    await queryInterface.changeColumn('Attendees', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4, // Generează automat UUID
      allowNull: false,
    });

    // Reconfigurează cheia primară
    await queryInterface.addConstraint('Attendees', {
      fields: ['id'],
      type: 'primary key',
      name: 'Attendees_pkey',
    });
  },

  async down(queryInterface, Sequelize) {
    // Elimină cheia primară existentă
    await queryInterface.removeConstraint('Attendees', 'Attendees_pkey');

    // Schimbă tipul coloanei `id` înapoi la integer
    await queryInterface.changeColumn('Attendees', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    });

    // Reconfigurează cheia primară
    await queryInterface.addConstraint('Attendees', {
      fields: ['id'],
      type: 'primary key',
      name: 'Attendees_pkey',
    });
  },
};
