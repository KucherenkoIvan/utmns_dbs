import db from "db";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export interface ProjectAttributes {
  id: number;
  name: string;
}

class Project
  extends Model<InferAttributes<Project>, InferCreationAttributes<Project>>
  implements ProjectAttributes
{
  id: CreationOptional<number>;
  name: string;
}

Project.init(
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
    tableName: "Projects",
    sequelize: db,
  }
);

db.define(Project.tableName, Project.getAttributes());

export default Project;
