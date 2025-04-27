module.exports = (sequelize, DataTypes) => {
    const Machine = sequelize.define('Machine', {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      name: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
      },
      description: { 
        type: DataTypes.TEXT, 
        allowNull: true 
      },
      image: { 
        type: DataTypes.STRING(255), 
        allowNull: true
      }
    }, {});
  
    return Machine;
  };