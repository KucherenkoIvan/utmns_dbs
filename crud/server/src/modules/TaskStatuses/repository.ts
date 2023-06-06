import { Repository } from "types/Repository";
import TaskStatus, { TaskStatusAttributes } from "./model";

export interface TaskStatussRepository
  extends Repository<TaskStatusAttributes> {
  save(name: TaskStatusAttributes["name"]): Promise<void>;
  find(name: TaskStatus["name"]): Promise<TaskStatusAttributes | null>;
  getAll(): Promise<TaskStatusAttributes[]>;
}

export class TaskStatusRepository implements TaskStatussRepository {
  async exists(
    field: keyof TaskStatusAttributes,
    value: string | number
  ): Promise<boolean> {
    const taskstatus = await TaskStatus.findOne({ where: { [field]: value } });

    return Boolean(taskstatus);
  }

  async save(name: TaskStatus["name"]): Promise<void> {
    await TaskStatus.create({ name });
  }

  async find(name: TaskStatus["name"]): Promise<TaskStatus | null> {
    const taskstatus = await TaskStatus.findOne({ where: { name } });

    return taskstatus || null;
  }

  async getAll(): Promise<TaskStatus[]> {
    const taskstatuss = await TaskStatus.findAll();

    return taskstatuss;
  }

  async getById(
    id: TaskStatusAttributes["id"]
  ): Promise<TaskStatusAttributes | null> {
    const taskstatus = await TaskStatus.findOne({ where: { id } });

    return taskstatus || null;
  }
}
