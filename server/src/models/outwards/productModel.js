module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.DOUBLE,
        },
        number: {
            type: DataTypes.DOUBLE,
        },
        uint: {
            type: DataTypes.STRING,
        },
        sellUint: {
            type: DataTypes.STRING,
        }
    })

    return Product
}