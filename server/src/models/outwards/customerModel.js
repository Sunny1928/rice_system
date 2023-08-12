module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("customer", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        homePhone: {
            type: DataTypes.STRING
        },
        contact: {
            type: DataTypes.STRING
        },
        taxId: {
            type: DataTypes.STRING
        }
    })

    return Customer
}