import { useEffect, useState } from "react";
import "./App.css";
import AuthForm from "./components/AuthForm";
import TaskManager from "./components/TaskManager";
import { supabase } from "./supabase-client";
import type { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setSession(currentSession.data.session);
  };

  useEffect(() => {
    fetchSession();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };
  return (
    <div>
      {session ? (
        <>
          <button onClick={logout}>Log out</button>
          <TaskManager session={session} />
        </>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

export default App;
