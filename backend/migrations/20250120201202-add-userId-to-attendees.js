"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Elimină constrângerea userId, dacă există
    await queryInterface.removeConstraint("Attendees", "Attendees_userId_fkey");

    // Elimină constrângerea id, dacă este cazul
    await queryInterface.removeConstraint("Attendees", "Attendees_pkey");
  },

  down: async (queryInterface, Sequelize) => {
    // Adaugă înapoi constrângerile, dacă este cazul
    await queryInterface.addConstraint("Attendees", {
      fields: ["userId"],
      type: "foreign key",
      name: "Attendees_userId_fkey",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Attendees", {
      fields: ["id"],
      type: "primary key",
      name: "Attendees_pkey",
    });
  },
};
