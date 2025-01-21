// 'use strict';

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.addColumn('Events', 'groupId', {
//       type: Sequelize.UUID,
//       references: {
//         model: 'EventGroups', // Tabelul asociat
//         key: 'id', // Cheia primară din tabelul EventGroups
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'SET NULL',
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.removeColumn('Events', 'groupId');
//   },
// };
