import * as argon from "argon2";
import config from "config";
import { Repository } from "types/Repository";
import { PositionAttributes } from "../Positions/model";
import { UserAttributes } from "./model";
import { UserRepository } from "./repository";

export interface UsersService {
  register(
    email: UserAttributes["email"],
    nickname: UserAttributes["nickname"],
    password: UserAttributes["password"],
    positionId: UserAttributes["positionId"]
  ): Promise<UserAttributes>;
  authenticate(
    nickname: UserAttributes["nickname"],
    password: UserAttributes["password"]
  ): Promise<UserAttributes>;
  getInfo(id: UserAttributes["id"]): Promise<UserAttributes>;
  getAll(): Promise<UserAttributes[]>;
}

export class UserService implements UsersService {
  private readonly _userRepo: UserRepository;
  private readonly _positionRepo: Repository<PositionAttributes>;

  constructor(
    userRepo: UserRepository,
    positionRepo: Repository<PositionAttributes>
  ) {
    this._userRepo = userRepo;
    this._positionRepo = positionRepo;
  }

  async register(
    email: string,
    nickname: string,
    password: string,
    positionId: number
  ): Promise<UserAttributes> {
    if (nickname.length < 4) {
      throw Error("Nickname must be 4 characters or longer");
    }
    if (password.length < 6) {
      throw Error("Password must be 6 characters or longer");
    }

    const isRoleExists = await this._positionRepo.exists("id", positionId);
    if (!isRoleExists) {
      throw new Error("Specified positionId does not exist");
    }

    const userInDb = await this._userRepo.find(nickname);
    if (userInDb) {
      throw new Error("Nickname is alredy taken");
    }

    const passwordHash = await argon.hash(password, {
      salt: config.ARGON_SALT,
      secret: config.ARGON_SECRET,
    });

    await this._userRepo.save(email, nickname, passwordHash, positionId);

    const createdUser = await this._userRepo.find(nickname);

    return createdUser;
  }

  async authenticate(
    nickname: string,
    password: string
  ): Promise<UserAttributes> {
    const candidate = await this._userRepo.find(nickname);

    if (!candidate) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await argon.verify(candidate.password, password, {
      salt: config.ARGON_SALT,
      secret: config.ARGON_SECRET,
    });

    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }

    return candidate;
  }

  async getInfo(id: UserAttributes["id"]) {
    const user = await this._userRepo.getById(id);
    const position = await this._positionRepo.getById?.(user.positionId);

    return { ...user, position };
  }

  async getAll() {
    const users = await this._userRepo.getAll();

    return users;
  }
}
