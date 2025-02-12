import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/admin"); // Redirect jika sudah login
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", form);
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      toast.success("Login berhasil!");
      navigate("/admin");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login gagal, periksa kredensial Anda.";
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-snavy to-navyDark">
      <div className="bg-navyDarkest text-navyDarkest p-8 rounded-lg shadow-md max-w-md w-full">
      <div className="text-center mb-5">
                            <h2 className="text-5xl font-extrabold leading-tight mb-4 text-white">
                                Admin <span className="text-creamyLight">Panel</span>
                            </h2>
                        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-creamyLight">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-creamyLight">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:ring focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-snavy text-white py-2 rounded hover:bg-navyDark transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
