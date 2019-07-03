module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    title: {type: DataTypes.STRING,
    unique: true}
  })

  return Country
}