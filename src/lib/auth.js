import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { clientPromise } from "./db";

const client = await clientPromise;
const db = client.db(process.env.DB_NAME || "ticketo");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "attendee",
        fieldName: "role",
        input: true,  // allow client to pass role on signup
      },
      isPremium: {
        type: "boolean",
        defaultValue: false,
        fieldName: "isPremium",
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
        fieldName: "isBlocked",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // New Google users will get 'attendee' role by default
      mapProfileToUser: (profile) => ({
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        role: "attendee",
        isPremium: false,
        isBlocked: false,
      }),
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "",
    process.env.BETTER_AUTH_URL || "",
  ].filter(Boolean),
});
