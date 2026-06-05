// Mock auth backend config to disable MongoDB and Kysely adapter initializations
export const auth = {
  secret: "fallback-secret-key-12345",
  database: null,
  emailAndPassword: {
    enabled: true
  }
};
