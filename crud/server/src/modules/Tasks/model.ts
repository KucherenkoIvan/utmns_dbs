import db from "db";
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import Project from "../Projects/model";
import TaskStatus from "../TaskStatuses/model";
import User from "../Users/model";

export interface TasksAttributes {
  id: number;
  name: string;
  description: string;
  timeSpent: number;
  startDate: Date;
  endDate: Date;
  parentId: number;
  projectId: number;
  statusId: number;
  assignee: number;
  author: number;
}

class Task
  extends Model<InferAttributes<Task>, InferCreationAttributes<Task>>
  implements TasksAttributes
{
  id: number;
  name: string;
  description: string;
  timeSpent: number;
  startDate: Date;
  endDate: Date;
  parentId: number;
  projectId: number;
  statusId: number;
  assignee: number;
  author: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    timeSpent: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      references: Task["id"],
      allowNull: true,
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: Project["id"],
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: TaskStatus["id"],
    },
    assignee: {
      type: DataTypes.UUID,
      allowNull: true,
      references: User["id"],
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    author: {
      type: DataTypes.UUID,
      allowNull: false,
      references: User["id"],
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    description: DataTypes.STRING,
  },
  {
    tableName: "Tasks",
    sequelize: db,
  }
);

db.define(Task.tableName, Task.getAttributes());

export default Task;
