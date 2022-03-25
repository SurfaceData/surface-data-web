declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      AUTH0_ISSUER: string;
      GITHUB_AUTH_ID: string;
      GITHUB_AUTH_SECRET: string;
      SECRET: string;
      NEXTAUTH_URL: string;
      DATABASE_URL: string;
      SEED_PATH: string;
    }
  }
}

export {}
