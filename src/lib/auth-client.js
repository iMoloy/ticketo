"use client";

import { createAuthClient } from "better-auth/react";

// Initialize the real BetterAuth client
let realAuthClient = null;
try {
  realAuthClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  });
} catch (e) {
  // Safe fallback for compilation boundaries
}

// Sandbox simulated auth client matching BetterAuth structure
const mockAuthClient = {
  signUp: {
    email: async ({ email, name, role }) => {
      alert("Mock Signup Successful! (Sandbox Mode)");
      return {
        data: { user: { name: name || "Jane Doe", email, role: role || "attendee" } },
        error: null
      };
    }
  },
  signIn: {
    email: async ({ email }) => {
      alert("Mock Login Successful! (Sandbox Mode)");
      return {
        data: { user: { name: "Jane Doe", email, role: "organizer" } },
        error: null
      };
    }
  },
  signOut: async () => {
    alert("Mock Logout! (Sandbox Mode)");
    return { data: null, error: null };
  },
  useSession: () => {
    return {
      data: {
        user: {
          name: "Jane Doe",
          email: "jane@example.com",
          image: "https://ui-avatars.com/api/?name=Jane+Doe&background=7c3aed&color=fff&bold=true",
          role: "organizer",
          isPremium: true
        },
        session: {
          id: "session_mock_12345",
          userId: "user_mock_12345",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      isPending: false,
      error: null,
      refetch: () => {}
    };
  }
};

// Check if user has opted into real database-backed authentication
const isRealAuthEnabled = process.env.NEXT_PUBLIC_USE_REAL_AUTH === "true";

export const authClient = (isRealAuthEnabled && realAuthClient) ? realAuthClient : mockAuthClient;

export const signUp = authClient.signUp;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
