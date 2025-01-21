'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Schimbă tipul coloanei groupId la UUID
    await queryInterface.changeColumn('Events', 'groupId', {
      type: Sequelize.UUID,
      references: {
        model: 'EventGroups',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertește tipul coloanei groupId la integer (dacă este necesar)
    await queryInterface.changeColumn('Events', 'groupId', {
      type: Sequelize.INTEGER,
    });
  },
};
