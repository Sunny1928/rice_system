module.exports = (sequelize, DataTypes) => {
    const sellUint = sequelize.define("sellUint", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return sellUint
}