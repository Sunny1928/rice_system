module.exports = (sequelize, DataTypes) => {
    const cashMethod = sequelize.define("cashMethods", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ratio:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return cashMethod
}