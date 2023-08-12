module.exports = (sequelize, DataTypes) => {
    const Trade = sequelize.define("inwardsRiceTrade", {
        turn_id: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        in: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        out: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        customer_name: {
            type: DataTypes.STRING
        },
        another_customer_name: {
            type: DataTypes.STRING
        },
        user_name: {
            type: DataTypes.STRING
        },
        go: {
            type: DataTypes.STRING
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