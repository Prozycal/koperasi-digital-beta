import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import logo from '../components/assets/yellow-icon.png';

const AdminLoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/admin");
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
      
      // Decode token dan verifikasi
      const decoded = jwtDecode(token);
      // Periksa apakah token berasal dari admin (berdasarkan username yang ada di token)
      if (!decoded.username) {
        toast.error("Akses ditolak: Bukan akun admin");
        return;
      }
      
      localStorage.setItem("authToken", token);
      toast.success("Login Admin berhasil!");
      navigate("/admin");
    } catch (error) {
      const message = error.response?.data?.message || "Login gagal, periksa kredensial Anda.";
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-snavy to-navyDark">
      <div className="bg-navyDarkest text-navyDarkest p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-8">
          <img src={logo} alt="logo" className="h-16 w-28 mx-auto mb-4" />
          <h2 className="text-4xl font-extrabold leading-tight text-white">
            Admin <span className="text-creamyLight">Login</span>
          </h2>
          <p className="text-gray-400 mt-2">Khusus untuk administrator Konest</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-creamyLight">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-creamyLight focus:ring-2 focus:ring-creamyLight"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-creamyLight">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-creamyLight focus:ring-2 focus:ring-creamyLight"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-creamyLight text-navyDarkest font-bold py-3 rounded-lg hover:bg-creamy transition-colors duration-300"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-creamyLight hover:text-creamy transition-colors duration-300">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;