import db from "db";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import ProjectRole from "../ProjectRoles/model";
import Project from "../Projects/model";
import User from "../Users/model";

export interface ProjectParticipantsAttributes {
  projectId: number;
  roleId: number;
  userId: string;
}

class ProjectParticipant
  extends Model<
    InferAttributes<ProjectParticipant>,
    InferCreationAttributes<ProjectParticipant>
  >
  implements ProjectParticipantsAttributes
{
  projectId: number;
  roleId: number;
  userId: string;
}

ProjectParticipant.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: Project["id"],
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: ProjectRole["id"],
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: User["id"],
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  },
  {
    tableName: "ProjectParticipants",
    sequelize: db,
  }
);

db.define(ProjectParticipant.tableName, ProjectParticipant.getAttributes());

export default ProjectParticipant;
