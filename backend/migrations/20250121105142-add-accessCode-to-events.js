module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Șterge toate rândurile din tabela Events
    await queryInterface.sequelize.query(`DELETE FROM "Events"`);

    // Adaugă coloana
    await queryInterface.addColumn('Events', 'accessCode', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'accessCode');
  },
};
