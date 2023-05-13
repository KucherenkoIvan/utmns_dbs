import db from "db";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export interface ProjectRoleAttributes {
  id: number;
  name: string;
}

class ProjectRole
  extends Model<
    InferAttributes<ProjectRole>,
    InferCreationAttributes<ProjectRole>
  >
  implements ProjectRoleAttributes
{
  declare id: CreationOptional<number>;
  declare name: string;
}

ProjectRole.init(
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
    tableName: "ProjectRoles",
    sequelize: db,
  }
);

db.define(ProjectRole.tableName, ProjectRole.getAttributes());

export default ProjectRole;
