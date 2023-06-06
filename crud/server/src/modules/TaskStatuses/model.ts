import db from "db";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

export interface TaskStatusAttributes {
  id: number;
  name: string;
}

class TaskStatus
  extends Model<
    InferAttributes<TaskStatus>,
    InferCreationAttributes<TaskStatus>
  >
  implements TaskStatusAttributes
{
  id: CreationOptional<number>;
  name: string;
}

TaskStatus.init(
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
    tableName: "TaskStatuses",
    sequelize: db,
  }
);

db.define(TaskStatus.tableName, TaskStatus.getAttributes());

export default TaskStatus;
