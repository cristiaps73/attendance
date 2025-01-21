module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    User.associate = (models) => {
      User.hasMany(models.EventGroup, { foreignKey: 'userId' }); // Relația cu EventGroup
    };
  
    return User;
  };
  