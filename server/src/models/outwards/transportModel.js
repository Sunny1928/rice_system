module.exports = (sequelize, DataTypes) => {
    const Transport = sequelize.define("transport", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        license: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        }
    })

    return Transport
}