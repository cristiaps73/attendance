'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Dacă constrângerea nu există, trecem direct la modificarea coloanei
    await queryInterface.removeColumn('Attendees', 'id');

    // Adaugă coloana `id` ca UUID
    await queryInterface.addColumn('Attendees', 'id', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertește modificările
    await queryInterface.removeColumn('Attendees', 'id');
    await queryInterface.addColumn('Attendees', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    });
  },
};
