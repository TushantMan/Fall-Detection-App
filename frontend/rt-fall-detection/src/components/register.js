import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import './auth.css';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const navigate = useNavigate();
  
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          if (user) {
            await setDoc(doc(db, "Users", user.uid), {
              email: user.email,
              firstName: fname,
              lastName: lname,
              photo: ""
            });
            toast.success("User Registered Successfully!!", {
              position: "top-center",
            });
            navigate("/login");
          }
        } catch (error) {
          console.log(error.message);
          toast.error(error.message, {
            position: "bottom-center",
          });
        }
      };

  return (
    <form onSubmit={handleRegister}>
      <h3>Create an account</h3>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setFname(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          onChange={(e) => setLname(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Create account
        </button>
      </div>
      
      <p className="forgot-password text-right">
        Already have an account? <a href="/login">Login</a>
      </p>
    </form>
  );
}
export default Register;