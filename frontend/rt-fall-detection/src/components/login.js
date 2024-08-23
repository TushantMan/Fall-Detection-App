import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SignInWithGoogle from "./signInWithGoogle";
import './auth.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("User logged in Successfully", {
          position: "top-center",
        });
        navigate("/dashboard"); // Changed from "/profile" to "/dashboard"
      } catch (error) {
        toast.error(error.message, {
          position: "bottom-center",
        });
      }
    };

  return (
    <div className="auth-container">
      <h3>Login to your account</h3>
      
      <SignInWithGoogle />

      <div className="divider">
        <span>Or</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="forgot-password text-right">
        Don't have an account? <a href="/register">Sign Up</a>
      </p>
      <p className="forgot-password text-right">
        <a href="/reset-password">Forgot password?</a>
      </p>
        </div>

        <button type="submit" className="btn btn-primary">
          Login now
        </button>
      </form>
    </div>
  );
}

export default Login;