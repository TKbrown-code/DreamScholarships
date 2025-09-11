import { createContext, useState, useEffect, useContext } from "react";
<<<<<<< HEAD
import { supabase } from "../lib/supabase";
=======
import { supabase } from "../lib/Supabase";
>>>>>>> c523b2b (auth fix)

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Get current session (on refresh)
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error fetching session:", error);

      setUser(data?.session?.user ?? null);
      setLoading(false);
    };
    getSession();

    // ✅ Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
