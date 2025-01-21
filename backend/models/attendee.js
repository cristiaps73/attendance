module.exports = (sequelize, DataTypes) => {
  const Attendee = sequelize.define("Attendee", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // Numele tabelului utilizatorilor
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    eventId: {
      type: DataTypes.UUID,
      references: {
        model: "Events",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  });

  Attendee.associate = (models) => {
    Attendee.belongsTo(models.Event, { foreignKey: "eventId" });
    Attendee.belongsTo(models.User, { foreignKey: "userId" }); // Legătura cu utilizatorii
  };

  return Attendee;
};
