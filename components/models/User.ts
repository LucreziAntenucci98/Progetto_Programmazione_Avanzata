import { DatabaseSingleton } from "./singletone/DatabaseSingleton";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize: Sequelize = DatabaseSingleton.getInstance().getConnessione();

export const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        primaryKey: true,
    }
}, 
{
    modelName: 'user',
    timestamps: false,
    freezeTableName: true
});