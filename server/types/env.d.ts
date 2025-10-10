declare namespace NodeJS {
  interface ProcessEnv {
    GCS_BUCKET?: string;
    FIRESTORE_EMULATOR_HOST?: string;
    S3_BUCKET?: string;
    S3_REGION?: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    ADMIN_USERNAME?: string;
    ADMIN_PASSWORD?: string;
    TOKEN_SECRET?: string;
  }
}


