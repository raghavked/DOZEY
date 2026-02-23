import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import type { User as SupabaseUser, Session, SupabaseClient } from "@supabase/supabase-js";

interface AuthState {
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const [client, setClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    let subscription: any;

    getSupabase().then((sb) => {
      setClient(sb);

      sb.auth.getSession().then(({ data: { session } }) => {
        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session?.user,
        });
      });

      const { data } = sb.auth.onAuthStateChange((_event, session) => {
        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session?.user,
        });
      });
      subscription = data.subscription;
    }).catch((err) => {
      console.error("Failed to initialize auth:", err);
      setState(prev => ({ ...prev, isLoading: false }));
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const sb = await getSupabase();
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const sb = await getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const sb = await getSupabase();
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  }, []);

  const getAccessToken = useCallback(async () => {
    const sb = await getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    return session?.access_token || null;
  }, []);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    getAccessToken,
  };
}
