import { Repository } from "types/Repository";
import User, { UserAttributes } from "./model";

export interface UserRepository extends Repository<UserAttributes> {
  save(
    email: UserAttributes["email"],
    nickname: UserAttributes["nickname"],
    passwordHash: UserAttributes["password"],
    positionId: UserAttributes["positionId"]
  ): Promise<void>;
  find(nickname: UserAttributes["nickname"]): Promise<UserAttributes | null>;
}

export class UserRepository implements UserRepository {
  async exists(
    field: keyof UserAttributes,
    value: string | number
  ): Promise<boolean> {
    const user = await User.findOne({ where: { [field]: value } });

    return Boolean(user);
  }

  async save(
    email: UserAttributes["email"],
    nickname: UserAttributes["nickname"],
    passwordHash: UserAttributes["password"],
    positionId: UserAttributes["positionId"]
  ): Promise<void> {
    await User.create({
      email,
      nickname,
      positionId,
      password: passwordHash,
    });
  }

  async getById(id: UserAttributes["id"]): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { id } });

    return user || null;
  }

  async find(nickname: UserAttributes["nickname"]): Promise<User | null> {
    const user = await User.findOne({ where: { nickname } });

    return user || null;
  }
}
