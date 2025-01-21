module.exports = (sequelize, DataTypes) => {
    const EventGroup = sequelize.define('EventGroup', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      repeatInterval: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    EventGroup.associate = (models) => {
      EventGroup.hasMany(models.Event, { foreignKey: 'groupId' }); // Relația cu Event
    };
  
    return EventGroup;
  };
  