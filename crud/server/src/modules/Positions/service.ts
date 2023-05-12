import { PositionAttributes } from "./model";
import { PositionRepository } from "./repository";

export interface PositionsService {
  createPosition(name: PositionAttributes["name"]): void;
  findByName(
    name: PositionAttributes["name"]
  ): Promise<PositionAttributes | null>;
  getAll(): Promise<PositionAttributes[]>;
}

export class PositionService implements PositionsService {
  private readonly _positionRepo: PositionRepository;

  constructor(positionRepo: PositionRepository) {
    this._positionRepo = positionRepo;
  }

  async createPosition(name: PositionAttributes["name"]): Promise<void> {
    if (name.length) {
      await this._positionRepo.save(name);
    } else throw new Error("Position name must be non-empty string");
  }

  async findByName(
    name: PositionAttributes["name"]
  ): Promise<PositionAttributes> {
    const position = await this._positionRepo.find(name);

    return position;
  }

  async getAll(): Promise<PositionAttributes[]> {
    const allPositions = await this._positionRepo.getAll();

    return allPositions;
  }
}
