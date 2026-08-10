function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Check your .env file (see .env.example).`,
    );
  }

  return value;
}

export const STANDARD_USER_USERNAME = requireEnv('STANDARD_USER_USERNAME');
export const STANDARD_USER_PASSWORD = requireEnv('STANDARD_USER_PASSWORD');
export const LOCKED_OUT_USER_USERNAME = requireEnv('LOCKED_OUT_USER_USERNAME');
