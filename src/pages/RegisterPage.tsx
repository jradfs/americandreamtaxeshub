import React, { useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabaseBrowserClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (evt: React.FormEvent) => {
    evt.preventDefault();
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    const { data, error } = await supabaseBrowserClient.auth.signUp({
      email,
      password,
    });
    if (error) {
      setErrorMsg(error.message);
    } else if (data?.user) {
      setSuccessMsg(
        "Registration successful! Check your email for confirmation.",
      );
      setErrorMsg("");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
