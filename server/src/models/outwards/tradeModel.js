module.exports = (sequelize, DataTypes) => {
    const Trade = sequelize.define("trade", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        number: {
            type: DataTypes.DOUBLE,
        },
        uint: {
            type: DataTypes.STRING,
        },
        amount: {
            type: DataTypes.INTEGER,
        },
        package: {
            type: DataTypes.INTEGER,
        },
        totalNumber: {
            type: DataTypes.INTEGER,
        },
        sellUint: {
            type: DataTypes.STRING,
        },
        uintPrice: {
            type: DataTypes.DOUBLE,
        },
        aTradePrice: {
            type: DataTypes.INTEGER,
        },
        grandPrice: {
            type: DataTypes.INTEGER,
        },
        customer_name: {
            type: DataTypes.STRING
        },
        user_name: {
            type: DataTypes.STRING
        },
        pay: {
            type: DataTypes.BOOLEAN,
        },
        transport: {
            type: DataTypes.STRING,
        },
        comment: {
            type: DataTypes.STRING
        },
        made_date:{
            type: DataTypes.DATE
        }
    })

    return Trade
}