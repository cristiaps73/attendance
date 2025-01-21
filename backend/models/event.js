const { v4: uuidv4 } = require('uuid'); // Pentru generarea UUID

function generateAccessCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.UUID, // Asigură-te că tipul este UUID
      references: {
        model: 'EventGroups',
        key: 'id',
      },
    },
    accessCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.VIRTUAL,
      get() {
        const now = new Date();
        return now >= this.startTime && now <= this.endTime ? 'OPEN' : 'CLOSED';
      },
    },
  });

  Event.beforeCreate(async (event) => {
    console.log('BeforeCreate hook called'); // Debugging
    let codeExists = true;

    while (codeExists) {
      const accessCode = generateAccessCode();
      console.log(`Generated access code: ${accessCode}`); // Debugging
      const existingEvent = await Event.findOne({ where: { accessCode } });

      if (!existingEvent) {
        event.accessCode = accessCode;
        codeExists = false;
        console.log(`Access code set: ${event.accessCode}`); // Debugging
      } else {
        console.log(`Access code ${accessCode} already exists, retrying...`);
      }
    }
  });

  Event.associate = (models) => {
    Event.belongsTo(models.EventGroup, { foreignKey: 'groupId' });
    Event.hasMany(models.Attendee, { foreignKey: 'eventId' });
  };

  return Event;
};
