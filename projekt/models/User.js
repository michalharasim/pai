module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
      },
      username: { 
        type: DataTypes.STRING(255), 
        unique: true, 
        allowNull: false 
      },
      password_hash: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
      },
      email: { 
        type: DataTypes.STRING(255), 
        unique: true, 
        allowNull: false 
      },
      phone: { 
        type: DataTypes.STRING(16), 
        allowNull: true 
      },
      role: { 
        type: DataTypes.ENUM('user', 'admin'), 
        allowNull: false 
      }
    }, {});
  
    return User;
  };