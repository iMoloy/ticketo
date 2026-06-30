import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { clientPromise } from "./db";

let realAuth = null;
try {
  const client = await clientPromise;
  if (client) {
    const db = client.db(process.env.DB_NAME || "ticketo");
    realAuth = betterAuth({
      database: mongodbAdapter(db),
      user: {
        additionalFields: {
          role: {
            type: "string",
            defaultValue: "attendee",
          },
          isPremium: {
            type: "boolean",
            defaultValue: false,
          },
          isBlocked: {
            type: "boolean",
            defaultValue: false,
          },
        },
      },
      emailAndPassword: {
        enabled: true,
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
      },
    });
  }
} catch (e) {
  console.warn("Real Auth backend config failed, falling back to mock auth configuration.", e);
}

const mockAuth = {
  secret: "fallback-secret-key-12345",
  database: null,
  emailAndPassword: {
    enabled: true,
  },
  api: {
    getSession: async () => {
      return {
        user: {
          name: "Jane Doe",
          email: "jane@example.com",
          role: "organizer",
          isPremium: true,
          isBlocked: false,
          image: "https://ui-avatars.com/api/?name=Jane+Doe&background=7c3aed&color=fff&bold=true",
        },
        session: {
          id: "session_mock_12345",
          userId: "user_mock_12345",
        },
      };
    },
  },
};

const isRealAuthEnabled = process.env.NEXT_PUBLIC_USE_REAL_AUTH === "true";

export const auth = (isRealAuthEnabled && realAuth) ? realAuth : mockAuth;
