import { Repository } from "types/Repository";
import Position, { PositionAttributes } from "./model";

export interface PositionsRepository extends Repository<PositionAttributes> {
  save(name: PositionAttributes["name"]): Promise<void>;
  find(name: Position["name"]): Promise<PositionAttributes | null>;
  getAll(): Promise<PositionAttributes[]>;
}

export class PositionRepository implements PositionsRepository {
  async exists(
    field: keyof PositionAttributes,
    value: string | number
  ): Promise<boolean> {
    const role = await Position.findOne({ where: { [field]: value } });

    return Boolean(role);
  }

  async save(name: Position["name"]): Promise<void> {
    await Position.create({ name });
  }

  async find(name: Position["name"]): Promise<Position | null> {
    const role = await Position.findOne({ where: { name } });

    return role || null;
  }

  async getAll(): Promise<Position[]> {
    const roles = await Position.findAll();

    return roles;
  }
}
