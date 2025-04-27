module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      machine_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
          model: 'Machines',
          key: 'id'
        }
      },
      start_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
      },
      end_date: { 
        type: DataTypes.DATEONLY, 
        allowNull: false 
      },
      reservation_date: { 
        type: DataTypes.DATE, 
        allowNull: false 
      }
    }, {});
  
    return Reservation;
  };