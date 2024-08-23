import React, { useState } from 'react';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import './auth.css';

function PasswordReset() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Check your inbox.', {
        position: 'top-center',
      });
    } catch (error) {
      toast.error(error.message, {
        position: 'bottom-center',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Reset your password</h3>

      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Send reset email
        </button>
      </div>

      <p className="forgot-password text-right">
        Remember your password? <a href="/login">Login</a>
      </p>
    </form>
  );
}

export default PasswordReset;