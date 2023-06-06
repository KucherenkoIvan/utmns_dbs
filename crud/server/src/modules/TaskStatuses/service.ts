import { TaskStatusAttributes } from "./model";
import { TaskStatusRepository } from "./repository";

export interface TaskStatussService {
  createTaskStatus(name: TaskStatusAttributes["name"]): void;
  findByName(
    name: TaskStatusAttributes["name"]
  ): Promise<TaskStatusAttributes | null>;
  getAll(): Promise<TaskStatusAttributes[]>;
}

export class TaskStatusService implements TaskStatussService {
  private readonly _taskstatusRepo: TaskStatusRepository;

  constructor(taskstatusRepo: TaskStatusRepository) {
    this._taskstatusRepo = taskstatusRepo;
  }

  async createTaskStatus(name: TaskStatusAttributes["name"]): Promise<void> {
    if (name.length) {
      await this._taskstatusRepo.save(name);
    } else throw new Error("TaskStatus name must be non-empty string");
  }

  async findByName(
    name: TaskStatusAttributes["name"]
  ): Promise<TaskStatusAttributes> {
    const taskstatus = await this._taskstatusRepo.find(name);

    return taskstatus;
  }

  async getAll(): Promise<TaskStatusAttributes[]> {
    const allTaskStatuss = await this._taskstatusRepo.getAll();

    return allTaskStatuss;
  }
}
