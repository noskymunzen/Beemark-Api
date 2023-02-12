declare namespace NodeJS {
  interface ProcessEnv {
    HOSTNAME: string;
    PORT: string;

    // Frontend
    APP_URI: string;

    JWT_SECRET: string;

    MONGODB_URI: string;
    MONGODB_DB: string;

    MAIL_SMTP_EMAIL: string;
    MAIL_SMTP_PASSWORD: string;
    MAIL_SMTP_HOST: string;
    MAIL_SMTP_DEFAULT_FROM: string;

    TELEGRAM_TOKEN?: string;
    TELEGRAM_GROUP?: string;
  }
}
