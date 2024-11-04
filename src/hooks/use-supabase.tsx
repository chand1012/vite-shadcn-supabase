// src/contexts/SupabaseContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createClient,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";
import { Database } from "@/types/database";

// Retrieve environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Define the shape of the context
interface SupabaseContextType {
  supabase: SupabaseClient<Database>;
  user: User | null;
  loading: boolean;
}

// Create the context with an undefined default value
const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

// Define the props for the provider component
interface SupabaseProviderProps {
  children: ReactNode;
}

// Create the provider component
export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
  children,
}) => {
  // Initialize the Supabase client once
  const [supabase] = useState(() =>
    createClient<Database>(supabaseUrl, supabaseAnonKey)
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the initial session and set the user
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getSession();

    // Subscribe to authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        console.log("User signed in:", session?.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        console.log("User signed out");
      }
      // Handle other events like TOKEN_REFRESHED if needed
    });

    // Cleanup the subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase, user, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

// Custom hook to access Supabase client
export const useSupabase = (): SupabaseClient<Database> => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context.supabase;
};

// Custom hook to access the authenticated user
export const useUser = (): User | null => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a SupabaseProvider");
  }
  return context.user;
};

// Optional: Hook to access loading state
export const useAuthLoading = (): boolean => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useAuthLoading must be used within a SupabaseProvider");
  }
  return context.loading;
};
