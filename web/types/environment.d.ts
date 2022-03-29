declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRE: string;
      EMAIL_SERVER: string;
      EMAIL_FROM: string;
      GITHUB_AUTH_ID: string;
      GITHUB_AUTH_SECRET: string;
      SECRET: string;
      NEXTAUTH_URL: string;
      DATABASE_URL: string;
      SEED_PATH: string;
      DISCORD_URL: string;
    }
  }
}

export {}
