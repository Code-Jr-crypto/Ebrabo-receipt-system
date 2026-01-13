import axios from "axios";
import { useState } from "react";

export default function Login({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "https://172.20.10.2:5000/api/auth/login",
        { username, password }
        // allow self-signed cert
      );

      if (res.data.success) setAuth(true);
      else alert("Invalid login");
    } catch (err) {
      alert("Cannot connect to server");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto" }}>
      <h2>EBRABO Receipt Login</h2>

      <input
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={login}>LOGIN</button>
    </div>
  );
}
