module.exports = (sequelize, DataTypes) => {
    const Trade = sequelize.define("inwardsOtherTrade", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        number: {
            type: DataTypes.INTEGER,
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
        loan: {
            type: DataTypes.STRING
        },
        customer_name: {
            type: DataTypes.STRING
        },
        user_name: {
            type: DataTypes.STRING
        },
        payLoanDate: {
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