import dotenv from "dotenv";

dotenv.config();

export const getEnvVariable = (name: string, defaultValue?: string): string => {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(
      `Environment variable ${name} is not defined and no default value is provided!`
    );
  }
  return value;
};
