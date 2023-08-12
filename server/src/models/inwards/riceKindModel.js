module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("inwardsRiceKind", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Product
}