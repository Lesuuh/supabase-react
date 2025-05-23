import { useState, type FormEvent } from "react";
import { supabase } from "../supabase-client";

const containerStyle = {
  backgroundColor: "#0a0a0a",
  color: "#fff",
  fontFamily: "'Inter', sans-serif",
  width: "350px",
  margin: "50px auto",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.7)",
};

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  margin: "10px 0 20px 0",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#222",
  color: "#fff",
  fontSize: "16px",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#fff",
  color: "#0a0a0a",
  fontWeight: "600",
  fontSize: "16px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  marginTop: "10px",
  transition: "background-color 0.3s ease",
};

const toggleButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#888",
  cursor: "pointer",
  marginTop: "15px",
  fontSize: "14px",
};

const titleStyle = {
  marginBottom: "25px",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "1px",
};

export default function AuthForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignIn) {
      const { error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signinError) {
        console.log("Error signing in", signinError.message);
      }
    } else {
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signupError) {
        console.log("Error signing up", signupError.message);
        return;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <p style={titleStyle}>{isSignIn ? "Sign In" : "Sign Up"}</p>

      {!isSignIn && (
        <input
          style={inputStyle}
          type="text"
          placeholder="Full Name"
          name="fullname"
          autoComplete="name"
        />
      )}

      <input
        style={inputStyle}
        type="email"
        placeholder="Email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={inputStyle}
        type="password"
        placeholder="Password"
        name="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isSignIn ? (
        <button style={buttonStyle}>Sign In</button>
      ) : (
        <button style={buttonStyle}>Sign Up</button>
      )}

      <button
        style={toggleButtonStyle}
        onClick={() => setIsSignIn(!isSignIn)}
        aria-label="Toggle sign in/sign up"
      >
        {isSignIn
          ? "Don't have an account? Sign Up"
          : "Already have an account? Sign In"}
      </button>
    </form>
  );
}
