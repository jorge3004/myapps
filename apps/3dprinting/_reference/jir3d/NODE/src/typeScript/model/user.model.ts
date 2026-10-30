import { DataTypes, Model, Optional } from 'sequelize';
import { mySequelize } from '../database/dbConnection';

interface UserAttributes {
    // id: number;
    userName: string;
    // email: string;
    // password: string;
}

// interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class User extends Model<UserAttributes> implements UserAttributes {
    // class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    // public id!: number;
    public userName!: string;
    // public email!: string;
    // public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        // id: {
        //     type: DataTypes.INTEGER.UNSIGNED,
        //     autoIncrement: true,
        //     primaryKey: true,
        // },
        userName: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        // email: {
        //     type: new DataTypes.STRING(128),
        //     allowNull: false,
        // },
        // password: {
        //     type: new DataTypes.STRING(128),
        //     allowNull: false,
        // },
    },
    {
        tableName: 'users',
        sequelize: mySequelize, // passing the `sequelize` instance is required
    }
);

export default User;