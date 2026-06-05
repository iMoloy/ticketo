"use client";

// Mock authClient to completely decouple from backend authentication
export const authClient = {
  signUp: async () => ({ 
    data: { user: { name: "Jane Doe", email: "jane@example.com", role: "organizer" } }, 
    error: null 
  }),
  signIn: async () => ({ 
    data: { user: { name: "Jane Doe", email: "jane@example.com", role: "organizer" } }, 
    error: null 
  }),
  signOut: async () => ({ 
    data: null, 
    error: null 
  }),
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

export const signUp = authClient.signUp;
export const signIn = authClient.signIn;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
