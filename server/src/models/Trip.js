module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    name: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    stop: DataTypes.STRING,
    substop: DataTypes.STRING
  })
  return Trip
}