declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URI: string
      PAYLOAD_SECRET: string
      NEXT_PUBLIC_SERVER_URL: string
      CRON_SECRET: string
      PREVIEW_SECRET: string
      ALLOW_SEED?: string
      SUPERADMIN_EMAIL: string
      SUPERADMIN_PASSWORD: string
      RAILWAY_PUBLIC_DOMAIN: string
      TRUSTED_PROXY_HOPS?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
