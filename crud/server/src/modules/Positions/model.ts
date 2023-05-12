import db from "db";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export interface PositionAttributes {
  id: number;
  name: string;
}

class Position
  extends Model<InferAttributes<Position>, InferCreationAttributes<Position>>
  implements PositionAttributes
{
  id: CreationOptional<number>;
  name: string;
}

Position.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "Roles",
    sequelize: db,
  }
);

db.define(Position.tableName, Position.getAttributes());

export default Position;
