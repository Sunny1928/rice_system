module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("inwardsProduct", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
        },
        price: {
            type: DataTypes.DOUBLE,
        }
    })

    return Product
}