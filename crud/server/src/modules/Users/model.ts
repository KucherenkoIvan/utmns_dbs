import db from "db";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import Position from "../Positions/model";

export interface UserAttributes {
  id: string;
  nickname: string;
  email: string;
  password: string;
  positionId: number;
}

class User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>>
  implements UserAttributes
{
  id: CreationOptional<string>;
  nickname: string;
  email: string;
  password: string;
  positionId: number;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nickname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: Position["id"],
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "Users",
    sequelize: db,
  }
);

db.define(User.tableName, User.getAttributes());

export default User;
