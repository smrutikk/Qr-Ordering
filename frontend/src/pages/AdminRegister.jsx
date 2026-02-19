import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API = "http://localhost:5000";

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/auth/register`, {
        email,
        password,
      });

      alert("Registered successfully!");
      navigate("/admin/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Admin Register
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-orange-500 text-white p-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}
