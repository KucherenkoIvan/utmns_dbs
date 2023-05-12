import dotenv from "dotenv";
import fs from "fs";
import p from "path";

export interface IAppConfig {
  NODE_ENV: string;
  APP_PORT: string;
  DB_PASSWORD: string;
  DB_USER: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_HOST: string;
  ARGON_SALT: Buffer;
  ARGON_SECRET: Buffer;
  JWT_SECRET: string;
}

const NODE_ENV = process.env.NODE_ENV || "development";
const path = p.resolve(p.join(__dirname, "../../config"));

const isEnvFileExists = fs.existsSync(path);

if (!isEnvFileExists) {
  throw new Error(`Can't read env file because it not exists (path: ${path})`);
}

const { parsed } = dotenv.config({ path });

const config: IAppConfig = {
  NODE_ENV,
  APP_PORT: parsed.APP_PORT,
  DB_PASSWORD: parsed.DB_PASSWORD,
  DB_USER: parsed.DB_USER,
  DB_PORT: Number(parsed.DB_PORT),
  DB_NAME: parsed.DB_NAME,
  DB_HOST: parsed.DB_HOST,
  ARGON_SALT: Buffer.from(parsed.ARGON_SALT),
  ARGON_SECRET: Buffer.from(parsed.ARGON_SECRET),
  JWT_SECRET: parsed.JWT_SECRET,
};

export default config;
