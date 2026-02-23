import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import type { User as SupabaseUser, Session, SupabaseClient } from "@supabase/supabase-js";

const SESSION_TIMEOUT_MS = 15 * 60 * 1000;

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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sbRef = useRef<SupabaseClient | null>(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      if (sbRef.current) {
        await sbRef.current.auth.signOut();
      }
    }, SESSION_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    if (!state.isAuthenticated) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const handler = () => resetTimeout();
    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    resetTimeout();

    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [state.isAuthenticated, resetTimeout]);

  useEffect(() => {
    let subscription: any;

    getSupabase().then((sb) => {
      setClient(sb);
      sbRef.current = sb;

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
