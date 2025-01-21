'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Elimină coloana existentă `eventId`
    await queryInterface.removeColumn('Attendees', 'eventId');

    // 2. Adaugă coloana `eventId` cu tipul UUID
    await queryInterface.addColumn('Attendees', 'eventId', {
      type: Sequelize.UUID,
      references: {
        model: 'Events', // Tabelul referit
        key: 'id', // Cheia primară referită
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Elimină coloana `eventId` adăugată
    await queryInterface.removeColumn('Attendees', 'eventId');

    // 2. Re-creează coloana `eventId` ca integer
    await queryInterface.addColumn('Attendees', 'eventId', {
      type: Sequelize.UUID,
    });
  },
};
