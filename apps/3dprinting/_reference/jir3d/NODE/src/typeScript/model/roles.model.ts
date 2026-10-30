import { DataTypes, Model, Optional } from 'sequelize';
import { mySequelize } from '../database/dbConnection';

interface RoleAttributes {
    id: number;
    name: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> { }

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
    },
    {
        tableName: 'roles',
        sequelize: mySequelize, // passing the `sequelize` instance is required
    }
);

export default Role;