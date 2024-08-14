import dotenv from "dotenv";
dotenv.config();

export interface ConfigInterface {
  MONGO: string;
  PORT: number;
}

const config: ConfigInterface = {
  MONGO: process.env.MONGO || "",
  PORT: parseInt(process.env.PORT || "3000"),
};

export const configuredKeys = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY as string,
};

export const env = process.env as {
  PORT: string;
  MONGO: string;
  JWT_SECRET_KEY: string;
  JWT_REFRESH_SECRET_KEY: string;
  MAILER_USER: string;
  MAILER_PASS: string;
  VITE_ORIGIN: string;
};

export default config;
