import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("https://reqres.in/api/login", {
        email,
        password,
      });
      login(response.data.token);
      navigate("/users");
    } catch (error) {
      setError("Invalid credentials!");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-500 bg-red-100 border border-red-400 px-4 py-2 rounded text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
